import { CheckIcon } from '../Icons/Icons';

export default function FeatureList({ items }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 text-sm font-medium text-white">
          <span className="grid size-6 flex-none place-items-center rounded-full bg-white/10 text-brand-200">
            <CheckIcon size={13} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
