export default function Checkbox({ label, checked, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 cursor-pointer accent-brand-800"
      />
      <span>{label}</span>
    </label>
  );
}
