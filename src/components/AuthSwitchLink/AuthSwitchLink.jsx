export default function AuthSwitchLink({ text, linkLabel, onClick }) {
  return (
    <p className="mt-7 text-center text-xs text-muted">
      {text}{' '}
      <button
        type="button"
        onClick={onClick}
        className="p-0 font-bold text-brand-800 hover:underline"
      >
        {linkLabel}
      </button>
    </p>
  );
}
