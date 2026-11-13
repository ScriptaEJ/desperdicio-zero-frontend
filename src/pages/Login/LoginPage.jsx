import { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useNavigate } from 'react-router-dom';

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
      // TODO: chamar o service de autenticação (ex.: authService.login)
      console.log('login', { email, password, remember });
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
