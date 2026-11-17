const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function FileIcon({ className = 'size-5' }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6" />
    </svg>
  );
}

export function DownloadIcon({ className = 'size-[18px]' }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
    </svg>
  );
}

export function PlusIcon({ className = 'size-[18px]' }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}