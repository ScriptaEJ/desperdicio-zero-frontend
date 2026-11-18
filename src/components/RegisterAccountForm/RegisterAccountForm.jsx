import { useState } from 'react';
import StepIndicator from '../StepIndicator/StepIndicator';
import AuthHeader from '../AuthHeader/AuthHeader';
import AuthSwitchLink from '../AuthSwitchLink/AuthSwitchLink';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import { UserIcon, MailIcon, LockIcon, ArrowRightIcon } from '../Icons/Icons';

const EMPTY = { nome: '', email: '', senha: '', confirmPassword: '', perfil: 'user' };

function validate(v) {
  const errors = {};
  if (!v.nome.trim()) errors.nome = 'Informe seu nome completo.';
  if (!/\S+@\S+\.\S+/.test(v.email)) errors.email = 'Informe um e-mail válido.';
  if (v.senha.length < 8) errors.senha = 'A senha precisa ter no mínimo 8 caracteres.';
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

        <TextField
          label="Senha"
          type="password"
          name="senha"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          icon={<LockIcon />}
          value={values.senha}
          onChange={handleChange('senha')}
          error={errors.senha}
        />

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