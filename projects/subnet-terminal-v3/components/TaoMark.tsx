/* The Bittensor τ mark — a thin, elegant capital-T, drawn as SVG so
   it stays sharp at any size and inherits colour from its context. */
export function TaoMark({
  size = 18,
  weight = 2.2,
  className,
}: {
  size?: number;
  weight?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="TAO"
    >
      <path
        d="M4 6.2H20M12 6.6V18.4"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
      />
    </svg>
  );
}
