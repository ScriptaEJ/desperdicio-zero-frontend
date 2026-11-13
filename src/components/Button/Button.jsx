const VARIANTS = {
  primary:
    'bg-brand-800 text-white shadow-[0_10px_22px_-10px_rgba(26,90,66,0.55)] hover:bg-brand-900',
};

export default function Button({
  children,
  variant = 'primary',
  icon,
  fullWidth = false,
  loading = false,
  ...rest
}) {
  const classes = [
    'inline-flex h-12 items-center justify-center gap-2.5 rounded-[14px] px-6 text-[13px] font-bold',
    'transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70',
    VARIANTS[variant],
    fullWidth ? 'w-full' : '',
  ].join(' ');

  return (
    <button className={classes} {...rest} disabled={loading || rest.disabled}>
      {loading ? 'Entrando...' : children}
      {!loading && icon}
    </button>
  );
}
