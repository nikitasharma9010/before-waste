/** A shared vector mark and live-text wordmark, usable on light or dark surfaces. */
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`brand ${footer ? 'brand-footer' : ''}`}>
      <img src="/brand-mark.svg" alt="" width="40" height="40" className="brand-mark" />
      <span className="brand-wordmark">BEFORE WASTE</span>
    </span>
  );
}
