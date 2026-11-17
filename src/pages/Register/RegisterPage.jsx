import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import RegisterAccountForm from '../../components/RegisterAccountForm/RegisterAccountForm';
import RegisterRestaurantForm from '../../components/RegisterRestaurantForm/RegisterRestaurantForm';
import { createUser } from '../../services/userServices'

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({});
  const [restaurant, setRestaurant] = useState({});
  const [loading, setLoading] = useState(false);

  const goToLogin = () => navigate('/login');

  const handleAccountSubmit = (values) => {
    setAccount(values);
    setStep(2);
  };

  const handleBack = (values) => {
    setRestaurant(values); // guarda o que já foi digitado
    setStep(1);
  };

  const handleFinish = async (values) => {
    setRestaurant(values);
    setLoading(true);
    try {
      const { confirmPassword, ...accountData } = account;
      const payload = { ...accountData, restaurant: values };

      // TODO: chamar o service de cadastro (ex.: authService.register(payload))
      await createUser(payload)
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
        />
      ) : (
        <RegisterRestaurantForm
          initialValues={restaurant}
          onSubmit={handleFinish}
          onBack={handleBack}
          onSignIn={goToLogin}
          loading={loading}
        />
      )}
    </AuthLayout>
  );
}
