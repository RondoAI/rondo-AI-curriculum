"""
Post a single tweet to @subnetmagazine via the Twitter API v2.

Usage (local, with a .env file in the same dir or env vars exported):
    python3 post.py "Today on @subnetmagazine: ..."
    echo "tweet body" | python3 post.py -

The script is intentionally small — one tweet, one POST, exit code 0/1.
Higher-level orchestration (scheduling, queue draining) is in run_queue.py.

Env vars required (set in .env locally or GitHub Actions secrets in CI):
    TWITTER_API_KEY              consumer key from developer.x.com
    TWITTER_API_SECRET           consumer secret
    TWITTER_ACCESS_TOKEN         access token (must have Read+Write perms)
    TWITTER_ACCESS_TOKEN_SECRET  access token secret
"""
from __future__ import annotations
import os
import sys
import json

try:
    import tweepy
except ImportError:
    sys.stderr.write("missing dep: pip install tweepy python-dotenv\n")
    sys.exit(2)

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass


def get_client() -> tweepy.Client:
    """Build a tweepy v2 client wired with the four OAuth 1.0a credentials
    needed for posting. Bearer token alone won't work for write operations."""
    needed = [
        "TWITTER_API_KEY",
        "TWITTER_API_SECRET",
        "TWITTER_ACCESS_TOKEN",
        "TWITTER_ACCESS_TOKEN_SECRET",
    ]
    missing = [k for k in needed if not os.environ.get(k)]
    if missing:
        sys.stderr.write(
            "missing env vars: " + ", ".join(missing) +
            "\nset them in .env or as GitHub Actions secrets\n"
        )
        sys.exit(2)
    return tweepy.Client(
        consumer_key=os.environ["TWITTER_API_KEY"],
        consumer_secret=os.environ["TWITTER_API_SECRET"],
        access_token=os.environ["TWITTER_ACCESS_TOKEN"],
        access_token_secret=os.environ["TWITTER_ACCESS_TOKEN_SECRET"],
    )


def post(text: str) -> dict:
    """POST a tweet. Returns a dict with the tweet id + url on success.
    Raises tweepy.errors.TweepyException on failure (caller decides what to do)."""
    text = text.strip()
    if not text:
        raise ValueError("empty tweet body")
    if len(text) > 280:
        raise ValueError(f"tweet body is {len(text)} chars (max 280)")
    client = get_client()
    resp = client.create_tweet(text=text)
    tid = resp.data["id"]
    return {"id": tid, "url": f"https://x.com/subnetmagazine/status/{tid}", "text": text}


def main() -> int:
    if len(sys.argv) != 2:
        sys.stderr.write("usage: post.py <text>   or   echo text | post.py -\n")
        return 2
    text = sys.stdin.read() if sys.argv[1] == "-" else sys.argv[1]
    try:
        result = post(text)
    except Exception as exc:
        sys.stderr.write(f"POST FAILED: {exc}\n")
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
