import { FormEvent, useEffect, useState } from "react";
import { Chrome, KeyRound, Loader2, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import type { AuthUser, LocalAuthClient } from "../../infrastructure/auth/LocalAuthClient";
import type { Language } from "../i18n";

type AuthMode = "login" | "register";

interface AuthScreenProps {
  authClient: LocalAuthClient;
  language: Language;
  onAuthenticated: (user: AuthUser) => void;
}

const authText = {
  ru: {
    login: "Вход",
    register: "Регистрация",
    titleLogin: "Войти в терминал",
    titleRegister: "Создать доступ",
    name: "Имя",
    email: "Email",
    password: "Пароль",
    passwordHint: "минимум 10 символов, буквы и цифры",
    submitLogin: "Войти",
    submitRegister: "Создать аккаунт",
    google: "Войти через Google",
    googleDisabledTitle: "Добавьте GOOGLE_CLIENT_SECRET",
    working: "Проверка"
  },
  en: {
    login: "Login",
    register: "Register",
    titleLogin: "Sign in to terminal",
    titleRegister: "Create access",
    name: "Name",
    email: "Email",
    password: "Password",
    passwordHint: "10+ characters, letters and numbers",
    submitLogin: "Sign in",
    submitRegister: "Create account",
    google: "Sign in with Google",
    googleDisabledTitle: "Set GOOGLE_CLIENT_SECRET",
    working: "Checking"
  }
} as const;

export const AuthScreen = ({ authClient, language, onAuthenticated }: AuthScreenProps) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const text = authText[language];

  useEffect(() => {
    let isMounted = true;

    authClient
      .getConfig()
      .then((config) => {
        if (isMounted) {
          setIsGoogleEnabled(config.googleEnabled);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsGoogleEnabled(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [authClient]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user =
        mode === "login"
          ? await authClient.login(email, password)
          : await authClient.register(name, email, password);

      onAuthenticated(user);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-label={text.titleLogin}>
        <div className="auth-brand-row">
          <div className="brand-mark auth-brand-mark">
            <ShieldCheck size={20} strokeWidth={1.5} />
          </div>
          <div>
            <div className="auth-product-name">Quantum-AI Wealth Guardian</div>
            <div className="auth-product-kicker">Secure Access Layer</div>
          </div>
        </div>

        <div className="auth-mode-switch" role="tablist" aria-label="Authentication mode">
          <button className={mode === "login" ? "auth-mode-active" : ""} type="button" onClick={() => setMode("login")}>
            {text.login}
          </button>
          <button className={mode === "register" ? "auth-mode-active" : ""} type="button" onClick={() => setMode("register")}>
            {text.register}
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>{mode === "login" ? text.titleLogin : text.titleRegister}</h1>

          {mode === "register" ? (
            <label className="auth-field">
              <span>{text.name}</span>
              <div>
                <UserRound size={16} strokeWidth={1.5} />
                <input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
            </label>
          ) : null}

          <label className="auth-field">
            <span>{text.email}</span>
            <div>
              <Mail size={16} strokeWidth={1.5} />
              <input
                autoComplete="email"
                inputMode="email"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </label>

          <label className="auth-field">
            <span>{text.password}</span>
            <div>
              <LockKeyhole size={16} strokeWidth={1.5} />
              <input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={10}
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            {mode === "register" ? <small>{text.passwordHint}</small> : null}
          </label>

          {error ? <div className="auth-error">{error}</div> : null}

          <button className="primary-button auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="auth-spinner" size={17} strokeWidth={1.5} /> : <KeyRound size={17} strokeWidth={1.5} />}
            <span>{isSubmitting ? text.working : mode === "login" ? text.submitLogin : text.submitRegister}</span>
          </button>
        </form>

        <button
          className="secondary-button auth-google-button"
          disabled={!isGoogleEnabled}
          title={!isGoogleEnabled ? text.googleDisabledTitle : undefined}
          type="button"
          onClick={() => authClient.startGoogleLogin()}
        >
          <Chrome size={17} strokeWidth={1.5} />
          <span>{text.google}</span>
        </button>
      </section>
    </main>
  );
};
