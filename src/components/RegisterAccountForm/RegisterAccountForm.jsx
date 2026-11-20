import { useState } from 'react';
import StepIndicator from '../StepIndicator/StepIndicator';
import AuthHeader from '../AuthHeader/AuthHeader';
import AuthSwitchLink from '../AuthSwitchLink/AuthSwitchLink';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import { UserIcon, MailIcon, LockIcon, ArrowRightIcon } from '../Icons/Icons';

const EMPTY = { nome: '', email: '', senha: '', confirmPassword: '', perfil: 'admin' };

const PASSWORD_RULES = [
  { id: 'length', label: 'Mínimo de 8 caracteres', test: (s) => s.length >= 8 },
  { id: 'lower', label: 'Letra minúscula (a-z)', test: (s) => /[a-z]/.test(s) },
  { id: 'upper', label: 'Letra maiúscula (A-Z)', test: (s) => /[A-Z]/.test(s) },
  { id: 'digit', label: 'Número (0-9)', test: (s) => /\d/.test(s) },
  { id: 'special', label: 'Caractere especial (@, #, $...)', test: (s) => /[^a-zA-Z0-9]/.test(s) },
];

function validate(v) {
  const errors = {};
  if (!v.nome.trim()) errors.nome = 'Informe seu nome completo.';
  if (!/\S+@\S+\.\S+/.test(v.email)) errors.email = 'Informe um e-mail válido.';

  const failedRule = PASSWORD_RULES.find((rule) => !rule.test(v.senha));
  if (failedRule) {
    errors.senha = `A senha precisa conter: ${failedRule.label.toLowerCase()}.`;
  }

  if (v.confirmPassword !== v.senha) errors.confirmPassword = 'As senhas não são iguais.';
  return errors;
}

export default function RegisterAccountForm({
  initialValues,
  onSubmit,
  onSignIn,
  loading = false,
  error = '',
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit?.(values);
  };

  return (
    <div className="w-full max-w-[470px]">
      <StepIndicator current={1} total={2} />
      <AuthHeader title="Crie sua conta" subtitle="Comece a reduzir perdas em poucos minutos." />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[22px]">
        <TextField
          label="Nome completo"
          name="nome"
          autoComplete="name"
          placeholder="Como podemos chamar você?"
          icon={<UserIcon />}
          value={values.nome}
          onChange={handleChange('nome')}
          error={errors.nome}
        />

        <TextField
          label="E-mail"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="seuemail@restaurante.com"
          icon={<MailIcon />}
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
        />

        <div className="space-y-2.5">
          <TextField
            label="Senha"
            type="password"
            name="senha"
            autoComplete="new-password"
            placeholder="Ex.: Cozinha@2026"
            icon={<LockIcon />}
            value={values.senha}
            onChange={handleChange('senha')}
            error={errors.senha}
          />

          {/* Checklist visual dos requisitos do PasswordStr */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 rounded-xl bg-slate-50/90 border border-slate-200/70 px-3.5 py-2.5">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(values.senha);
              return (
                <li
                  key={rule.id}
                  className={`flex items-center gap-2 text-[11.5px] transition-colors ${
                    ok ? 'font-medium text-[#14573f]' : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      ok
                        ? 'bg-[#14573f] text-white'
                        : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {ok && (
                      <svg
                        className="w-2.5 h-2.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                      >
                        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span>{rule.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <TextField
          label="Confirmar senha"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Digite a senha novamente"
          icon={<LockIcon />}
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
        />

        {error && (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          loading={loading}
          loadingText="Criando conta..."
          icon={<ArrowRightIcon />}
        >
          Continuar
        </Button>
      </form>

      <AuthSwitchLink text="Já possui uma conta?" linkLabel="Entrar" onClick={onSignIn} />
    </div>
  );
}