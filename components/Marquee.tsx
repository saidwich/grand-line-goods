const items = [
  "Fan-made, not for sale",
  "Figures · Apparel · Posters · Accessories",
  "Set sail for treasure",
  "Stripe test card 4242 4242 4242 4242",
];

export default function Marquee() {
  return (
    <div className="marquee overflow-hidden bg-ink py-2 font-mono text-xs uppercase tracking-[0.25em] text-paper">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex gap-10 pr-10" aria-hidden={k === 1}>
            {items.map((t) => (
              <span key={t}>
                {t} <span className="text-vermilion">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}