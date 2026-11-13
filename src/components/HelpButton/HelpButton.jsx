export default function HelpButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ajuda"
      className="fixed bottom-4 right-4 z-10 grid size-8 place-items-center rounded-full bg-[#1c1f1e] text-[15px] font-semibold text-white shadow-lg"
    >
      ?
    </button>
  );
}
