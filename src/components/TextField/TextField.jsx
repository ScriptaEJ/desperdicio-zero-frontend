import { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../Icons/Icons';

export default function TextField({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  ...rest
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && visible ? 'text' : type;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-bold text-ink">
        {label}
      </label>

      <div
        className={[
          'flex h-[50px] items-center gap-3 rounded-[14px] border bg-white px-4 text-muted transition',
          'focus-within:border-brand-500 focus-within:ring-[3px] focus-within:ring-brand-500/15',
          error ? 'border-danger' : 'border-line',
        ].join(' ')}
      >
        {icon && <span className="grid place-items-center">{icon}</span>}

        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-0 placeholder:text-[#8c9a94]"
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            className="grid place-items-center rounded-md p-1 text-muted hover:text-ink"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
