import { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../services/authService'

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate()

  const handleLogin = async ({ email, password, remember }) => {
    setError('');

    if (!email || !password) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setLoading(true);
    try {
      await loginRequest(email, password)
      navigate('/visao-geral')
    } catch (err) {
      setError('Não foi possível entrar. Confira seus dados e tente de novo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout onHelp={() => console.log('ajuda')}>
      <LoginForm
        onSubmit={handleLogin}
        onForgotPassword={() => console.log('esqueci a senha')}
        onSignUp={() => navigate('/cadastro')}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}
