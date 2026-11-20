import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import RegisterAccountForm from '../../components/RegisterAccountForm/RegisterAccountForm';
import RegisterRestaurantForm from '../../components/RegisterRestaurantForm/RegisterRestaurantForm';
import { loginRequest } from '../../services/authService';
import { extrairErroApi } from '../../services/insumosService';
import { createRestaurant } from '../../services/restaurantServices';
import { createUser } from '../../services/userServices';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const [userCreated, setUserCreated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const goToLogin = () => navigate('/login');

  // ETAPA 1 → registra o usuário e já autentica para liberar a Etapa 2
  const handleAccountSubmit = async (values) => {
    setAccount(values);
    setError('');

    if (userCreated) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = values;
      const payloadUsuario = {
        perfil: 'admin',
        ...userData,
      };

      await createUser(payloadUsuario);

      // Autentica automaticamente para obter o token exigido em POST /restaurantes/
      const email = payloadUsuario.email;
      const senha = payloadUsuario.senha || payloadUsuario.password;
      if (email && senha) {
        await loginRequest(email, senha);
      }

      setUserCreated(true);
      setStep(2);
    } catch (err) {
      setError(
        extrairErroApi(err, 'Não foi possível criar sua conta. Tente novamente.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = (values) => {
    setRestaurant(values);
    setError('');
    setStep(1);
  };

  // ETAPA 2 → registra o restaurante já vinculado ao usuário logado
  const handleFinish = async (values) => {
    setRestaurant(values);
    setError('');
    setLoading(true);
    try {
      const novoRestaurante = await createRestaurant({
        nome: values.restaurantName,
        cwid: values.cwid?.trim() || null,
        custo_medio_kg: Number(String(values.costPerKg).replace(',', '.')),
      });

      if (novoRestaurante?.id != null) {
        localStorage.setItem('restaurante_id', String(novoRestaurante.id));
      }

      // Como já está autenticado, pode ir direto para a Visão Geral
      navigate('/visao-geral');
    } catch (err) {
      setError(
        extrairErroApi(
          err,
          'Não foi possível cadastrar o restaurante. Tente novamente.'
        )
      );
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