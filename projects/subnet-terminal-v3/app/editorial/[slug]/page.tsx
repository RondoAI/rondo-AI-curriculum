"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ARTICLES } from "@/data/seed/editorial";
import { DetailHeader } from "@/components/chrome/DetailHeader";
import { VERTICAL_ACCENT, VERTICAL_LABEL } from "@/lib/panels";
import type { Block } from "@/lib/domain/editorial";

function BlockView({ block, accent }: { block: Block; accent: string }) {
  switch (block.kind) {
    case "h":
      return (
        <h2 className="font-serif text-[19px] text-ink-1 mt-3">{block.text}</h2>
      );
    case "p":
      return (
        <p className="text-[14px] leading-relaxed text-ink-2">{block.text}</p>
      );
    case "quote":
      return (
        <blockquote
          className="my-1 pl-4 border-l-2 flex flex-col gap-1"
          style={{ borderColor: accent }}
        >
          <span className="font-serif text-[16px] leading-snug text-ink-1">
            “{block.text}”
          </span>
          {block.cite && (
            <span className="text-[11px] smallcaps text-ink-3">— {block.cite}</span>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-1.5 pl-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-ink-2">
              <span style={{ color: accent }} aria-hidden="true">
                —
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
  }
}

export default function ArticleReader() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  const article = ARTICLES.find((a) => a.slug === slug);
  const more = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <>
        <DetailHeader kind="editorial" crumb={slug} />
        <div className="flex-1 flex items-center justify-center text-ink-3 text-[13px]">
          No piece at that slug. It may have been unpublished, or never set.
        </div>
      </>
    );
  }

  const accent = VERTICAL_ACCENT[article.vertical];

  return (
    <>
      <DetailHeader kind="editorial" crumb={article.title} />
      <main className="flex-1 min-h-0 overflow-y-auto">
        <article className="max-w-[680px] mx-auto px-5 py-8 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] smallcaps px-1.5 py-0.5 border"
              style={{ color: accent, borderColor: accent + "55" }}
            >
              {VERTICAL_LABEL[article.vertical]}
            </span>
            <span className="tnum text-[10px] text-ink-3">{article.date}</span>
            <span className="tnum text-[10px] text-ink-3">· {article.readMins} min read</span>
          </div>

          <h1 className="font-serif text-[34px] leading-[1.15] text-ink-1">
            {article.title}
          </h1>
          <p className="font-serif text-[17px] leading-snug text-ink-3 italic">
            {article.deck}
          </p>
          <p className="text-[11px] smallcaps text-ink-3 border-b border-hairline pb-3">
            {article.author}
          </p>

          <div className="flex flex-col gap-3 pt-1">
            {article.body.map((b, i) => (
              <BlockView key={i} block={b} accent={accent} />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-hairline flex flex-col gap-2">
            <span className="text-[10px] smallcaps text-ink-3">more from the desk</span>
            {more.map((a) => (
              <Link
                key={a.slug}
                href={`/editorial/${a.slug}`}
                className="group flex items-baseline gap-2"
              >
                <span
                  className="text-[8px] smallcaps shrink-0"
                  style={{ color: VERTICAL_ACCENT[a.vertical] }}
                >
                  {VERTICAL_LABEL[a.vertical]}
                </span>
                <span className="font-serif text-[15px] text-ink-2 group-hover:text-ink-1">
                  {a.title}
                </span>
              </Link>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
