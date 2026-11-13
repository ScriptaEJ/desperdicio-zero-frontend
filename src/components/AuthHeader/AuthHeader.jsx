export default function AuthHeader({ title, subtitle }) {
  return (
    <header className="mb-9">
      <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-800">
        Desperdício Zero
      </p>
      <h1 className="mb-3 text-[34px] font-extrabold leading-tight tracking-[-0.035em] text-ink">
        {title}
      </h1>
      <p className="text-sm text-muted">{subtitle}</p>
    </header>
  );
}
