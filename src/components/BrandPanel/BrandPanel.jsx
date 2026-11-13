import Logo from '../Logo/Logo';
import FeatureList from '../FeatureList/FeatureList';

const FEATURES = [
  'Descubra onde e quando as perdas acontecem',
  'Receba alertas e recomendações práticas',
  'Reduza custos sem comprometer a qualidade',
];

export default function BrandPanel() {
  return (
    <aside className="relative flex h-full flex-col justify-between overflow-hidden bg-brand-900 p-12 text-white">
      {/* decoração */}
      <span aria-hidden className="pointer-events-none absolute -left-[230px] -top-[230px] size-[500px] rounded-full border border-white/10" />
      <span aria-hidden className="pointer-events-none absolute -left-[170px] -top-[170px] size-[520px] rounded-full border border-white/10" />
      <span aria-hidden className="pointer-events-none absolute -bottom-[260px] -right-[210px] size-[640px] rounded-full bg-brand-700" />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-12 h-14 w-[70px] bg-[radial-gradient(rgba(255,255,255,0.35)_1.5px,transparent_1.6px)] bg-[length:16px_16px]"
      />

      <header className="relative">
        <Logo />
      </header>

      <div className="relative my-auto max-w-[440px] pt-28">
        <p className="mb-[18px] text-[11px] font-bold uppercase tracking-[0.22em] text-brand-200">
          Gestão inteligente de perdas
        </p>

        <h2 className="mb-7 text-[clamp(34px,3.4vw,46px)] font-extrabold leading-[1.05] tracking-[-0.035em]">
          Menos desperdício.
          <span className="block text-accent">Mais resultado.</span>
        </h2>

        <p className="mb-9 max-w-[420px] text-base leading-relaxed text-white/80">
          Transforme cada registro da cozinha em decisões mais eficientes para
          o seu restaurante.
        </p>

        <FeatureList items={FEATURES} />
      </div>

      <footer className="relative text-xs text-white/60">© 2026 Desperdício Zero</footer>
    </aside>
  );
}
