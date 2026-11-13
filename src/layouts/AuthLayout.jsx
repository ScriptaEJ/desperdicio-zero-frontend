import BrandPanel from '../components/BrandPanel/BrandPanel';
import HelpButton from '../components/HelpButton/HelpButton';

/**
 * Layout das telas de autenticação (login, cadastro, recuperar senha...).
 * Painel de marca à esquerda + conteúdo (children) à direita.
 * Abaixo de 900px o painel de marca some.
 */
export default function AuthLayout({ children, onHelp }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-canvas min-[900px]:grid-cols-[46fr_54fr]">
      <div className="hidden min-h-screen min-[900px]:block">
        <BrandPanel />
      </div>

      <main className="flex items-center justify-center px-8 py-12">{children}</main>

      <HelpButton onClick={onHelp} />
    </div>
  );
}
