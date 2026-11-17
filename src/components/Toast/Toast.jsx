export default function Toast({ message }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-7 left-1/2 max-w-[90vw] -translate-x-1/2 rounded-xl bg-ink px-5 py-3 font-semibold text-page transition-all duration-200 ${
        message ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {message}
    </div>
  );
}