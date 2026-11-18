import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import RegisterAccountForm from '../../components/RegisterAccountForm/RegisterAccountForm';
import RegisterRestaurantForm from '../../components/RegisterRestaurantForm/RegisterRestaurantForm';
import { createUser } from '../../services/userServices';
import { createRestaurant } from '../../services/restaurantServices';

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.message || fallback;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const [user, setUser] = useState(null); // usuário já criado na etapa 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const goToLogin = () => navigate('/login');

  // ETAPA 1 → registra o usuário
  const handleAccountSubmit = async (values) => {
    setAccount(values);
    setError('');

    // se voltou da etapa 2, o usuário já existe: não cria de novo
    if (user) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = values;
      const createdUser = await createUser(userData);
      setUser(createdUser);
      setStep(2);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível criar sua conta. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (values) => {
    setRestaurant(values); // guarda o que já foi digitado
    setError('');
    setStep(1);
  };

  // ETAPA 2 → registra o restaurante
  const handleFinish = async (values) => {
    setRestaurant(values);
    setError('');
    setLoading(true);
    try {
      await createRestaurant({
        nome: values.restaurantName,
        cwid: values.cwid.trim() || null,
        custo_medio_kg: Number(values.costPerKg.replace(',', '.')),
        userId: user?.id,
      });
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível cadastrar o restaurante. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout onHelp={() => console.log('ajuda')}>
      {step === 1 ? (
        <RegisterAccountForm
          initialValues={account}
          onSubmit={handleAccountSubmit}
          onSignIn={goToLogin}
          loading={loading}
          error={error}
        />
      ) : (
        <RegisterRestaurantForm
          initialValues={restaurant}
          onSubmit={handleFinish}
          onBack={handleBack}
          onSignIn={goToLogin}
          loading={loading}
          error={error}
        />
      )}
    </AuthLayout>
  );
}