const NAMES = [
  "Ajo",
  "Esusu",
  "Adashe",
  "Etoto",
  "Osusu",
  "Susu",
  "Tontine",
  "Chama",
  "Stokvel",
  "Chit fund",
  "Hui",
  "Cundina",
];

export function LandingMarquee() {
  return (
    <section className="border-y border-primary-light/30 bg-primary py-5 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-8">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Same idea, different name
        </p>
        <div className="pc-marquee relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]">
          <div className="pc-marquee-track flex w-max items-center gap-8">
            {[...NAMES, ...NAMES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-8 font-display text-lg text-white/85"
              >
                {name}
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
