import { useState } from 'react';
import StepIndicator from '../StepIndicator/StepIndicator';
import AuthHeader from '../AuthHeader/AuthHeader';
import AuthSwitchLink from '../AuthSwitchLink/AuthSwitchLink';
import TextField from '../TextField/TextField';
import Checkbox from '../Checkbox/Checkbox';
import Button from '../Button/Button';
import { BuildingIcon, ArrowRightIcon } from '../Icons/Icons';
import { formatCnpj } from '../../utils/formatCnpj';

const EMPTY = { restaurantName: '', cnpj: '', costPerKg: '', acceptedTerms: false };

const legalLink = 'font-bold text-brand-800 hover:underline';

function validate(v) {
  const errors = {};
  if (!v.restaurantName.trim()) errors.restaurantName = 'Informe o nome do restaurante.';
  if (v.cnpj.replace(/\D/g, '').length !== 14) errors.cnpj = 'Informe um CNPJ com 14 dígitos.';
  if (!(Number(v.costPerKg.replace(',', '.')) > 0)) errors.costPerKg = 'Informe um custo maior que zero.';
  if (!v.acceptedTerms) errors.acceptedTerms = 'Aceite os termos para criar sua conta.';
  return errors;
}

export default function RegisterRestaurantForm({
  initialValues,
  onSubmit,
  onBack,
  onSignIn,
  loading = false,
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});

  const setField = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
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
      <StepIndicator current={2} total={2} />
      <AuthHeader
        title="Cadastre o restaurante"
        subtitle="Esses dados poderão ser alterados depois."
      />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[22px]">
        <TextField
          label="Nome do restaurante"
          name="restaurantName"
          autoComplete="organization"
          placeholder="Ex.: Cantina da Vila"
          icon={<BuildingIcon />}
          value={values.restaurantName}
          onChange={(e) => setField('restaurantName', e.target.value)}
          error={errors.restaurantName}
        />

        <TextField
          label="CNPJ"
          name="cnpj"
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          icon={<BuildingIcon />}
          value={values.cnpj}
          onChange={(e) => setField('cnpj', formatCnpj(e.target.value))}
          error={errors.cnpj}
        />

        <TextField
          label="Custo médio por kg"
          name="costPerKg"
          inputMode="decimal"
          placeholder="0,00"
          prefix="R$"
          value={values.costPerKg}
          onChange={(e) => setField('costPerKg', e.target.value.replace(/[^\d.,]/g, ''))}
          error={errors.costPerKg}
        />

        <div className="flex flex-col gap-1.5">
          <Checkbox
            checked={values.acceptedTerms}
            onChange={(e) => setField('acceptedTerms', e.target.checked)}
            label={
              <>
                Concordo com os{' '}
                <a href="/termos" target="_blank" rel="noreferrer" className={legalLink}>
                  Termos de Uso
                </a>{' '}
                e a{' '}
                <a href="/privacidade" target="_blank" rel="noreferrer" className={legalLink}>
                  Política de Privacidade
                </a>
                .
              </>
            }
          />
          {errors.acceptedTerms && (
            <span className="text-xs text-danger">{errors.acceptedTerms}</span>
          )}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => onBack?.(values)}>
            Voltar
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={loading}
            loadingText="Criando conta..."
            icon={<ArrowRightIcon />}
          >
            Criar conta
          </Button>
        </div>
      </form>

      <AuthSwitchLink text="Já possui uma conta?" linkLabel="Entrar" onClick={onSignIn} />
    </div>
  );
}
