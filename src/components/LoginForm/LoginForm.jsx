import { useState } from 'react';
import TextField from '../TextField/TextField';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';
import { MailIcon, LockIcon, ArrowRightIcon } from '../Icons/Icons';

const linkClass = 'p-0 text-xs font-bold text-brand-800 hover:underline';

export default function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUp,
  onDemo,
  loading = false,
  error = '',
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({ email, password, remember });
  };

  return (
    <div className="w-full max-w-[470px]">
      <p className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-800">
        Desperdício Zero
      </p>
      <h1 className="mb-3 text-[34px] font-extrabold tracking-[-0.035em] text-ink">
        Bem-vindo de volta
      </h1>
      <p className="mb-9 text-sm text-muted">
        Acesse sua conta para acompanhar os resultados.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[22px]">
        <TextField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="seuemail@restaurante.com"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Lembrar de mim"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <button type="button" onClick={onForgotPassword} className={linkClass}>
            Esqueci minha senha
          </button>
        </div>

        <Button type="submit" fullWidth loading={loading} icon={<ArrowRightIcon />}>
          Acessar sistema
        </Button>
      </form>

      <p className="mt-7 text-center text-xs text-muted">
        Ainda não tem uma conta?{' '}
        <button type="button" onClick={onSignUp} className={linkClass}>
          Cadastre seu restaurante
        </button>
      </p>
    </div>
  );
}
