import { useEffect, useState } from 'react';
import './index.css';

type Consent = { necessary: boolean; preferences: boolean; analytics: boolean; marketing: boolean; savedAt: string };
type ModalName = 'privacy' | 'cookies' | 'preferences' | null;

const WHATSAPP = '5511998971326';
const EMAIL = 'Ms.solucoesfinanceiras19@gmail.com';
const CNPJ = '66.149.478/0001-96';
const ADDRESS = 'Rua Aristides Benedito, Parque Residencial Triunfo, Nova Odessa – SP, CEP 13387-672';
const DEFAULT_CONSENT: Consent = { necessary: true, preferences: false, analytics: false, marketing: false, savedAt: '' };

function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function updateGoogleConsent(consent: Consent) {
  // Não carrega Google tags. Se uma integração real for adicionada depois,
  // atualiza os sinais somente quando a função gtag já estiver configurada.
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      functionality_storage: consent.preferences ? 'granted' : 'denied',
      security_storage: 'granted',
    });
  }
}

export default function App() {
  const [consent, setConsent] = useState<Consent>(DEFAULT_CONSENT);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);
  const [draft, setDraft] = useState<Consent>(DEFAULT_CONSENT);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', type: 'Plano empresarial (CNPJ)', city: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ms-consultoria-cookie-consent-v1');
      if (raw) {
        const saved = JSON.parse(raw) as Consent;
        const next = { ...DEFAULT_CONSENT, ...saved, necessary: true };
        setConsent(next);
        setDraft(next);
        updateGoogleConsent(next);
      } else {
        setBannerVisible(true);
      }
    } catch {
      setBannerVisible(true);
    }
  }, []);

  function saveConsent(next: Consent) {
    const finalConsent = { ...next, necessary: true, savedAt: new Date().toISOString() };
    try { localStorage.setItem('ms-consultoria-cookie-consent-v1', JSON.stringify(finalConsent)); } catch { /* site segue funcionando mesmo se armazenamento estiver indisponível */ }
    setConsent(finalConsent);
    setDraft(finalConsent);
    updateGoogleConsent(finalConsent);
    setBannerVisible(false);
    setModal(null);
  }

  function openPreferences() {
    setDraft(consent);
    setBannerVisible(false);
    setModal('preferences');
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = `Olá! Gostaria de receber orientação da M.S Consultoria.\nNome: ${form.name}\nTelefone: ${form.phone}\nInteresse: ${form.type}\nCidade/UF: ${form.city}`;
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  const navItems = [
    ['Início', '#inicio'], ['Planos empresariais', '#empresarial'], ['Planos individuais e familiares', '#individual-familiar'], ['Sobre nós', '#sobre'], ['Contato', '#contato'],
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="M.S Consultoria - início"><img src="/logo-nova.jpg" alt="Logo M.S Consultoria — Saúde e Benefícios Empresariais" /></a>
        <button className="menu-toggle" aria-label="Abrir menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? '✕' : '☰'}</button>
        <nav className={mobileMenu ? 'main-nav open' : 'main-nav'}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileMenu(false)}>{label}</a>)}
          <a className="button button-small" href={whatsappUrl('Olá! Acessei o site da M.S Consultoria e gostaria de solicitar uma cotação.')} target="_blank" rel="noreferrer">Solicitar cotação</a>
        </nav>
      </header>

      <main>
        <section className="hero section" id="inicio">
