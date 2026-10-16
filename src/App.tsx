import { useEffect, useState } from 'react';
import './index.css';

type Consent = { necessary: boolean; preferences: boolean; analytics: boolean; marketing: boolean; savedAt: string };
type ModalName = 'privacy' | 'cookies' | 'preferences' | null;

const WHATSAPP = '5519920003380';
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
        <a className="brand" href="#inicio" aria-label="M.S Consultoria - início"><img src="/logo-ms.jpg" alt="Logo M.S Consultoria — Saúde e Benefícios Empresariais" /></a>
        <button className="menu-toggle" aria-label="Abrir menu" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? '✕' : '☰'}</button>
        <nav className={mobileMenu ? 'main-nav open' : 'main-nav'}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileMenu(false)}>{label}</a>)}
          <a className="button button-small" href={whatsappUrl('Olá! Acessei o site da M.S Consultoria e gostaria de solicitar uma cotação.')} target="_blank" rel="noreferrer">Solicitar cotação</a>
        </nav>
      </header>

      <main>
        <section className="hero section" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-line" /> CONSULTORIA EM SAÚDE E BENEFÍCIOS</span>
            <h1>Seu plano de saúde ideal começa com <em>uma boa consultoria.</em></h1>
            <p className="hero-lead">Encontre opções de planos de saúde para sua empresa, sua família ou você. Ajudamos a comparar alternativas de acordo com seu perfil, suas necessidades e seu orçamento.</p>
            <div className="hero-actions">
              <a className="button" href={whatsappUrl('Olá! Acessei o site da M.S Consultoria e gostaria de conhecer opções de planos de saúde para minha empresa.')} target="_blank" rel="noreferrer">Quero um plano empresarial <span>↗</span></a>
              <a className="button button-outline" href={whatsappUrl('Olá! Acessei o site da M.S Consultoria e gostaria de conhecer opções de planos de saúde individual ou familiar.')} target="_blank" rel="noreferrer">Individual ou familiar <span>↗</span></a>
            </div>
            <div className="trust-note"><span className="check-icon">✓</span> Orientação consultiva para uma escolha mais consciente</div>
          </div>
          <div className="hero-visual" aria-label="Ilustração abstrata que representa cuidado e proteção">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="visual-card card-main"><div className="shield">✦</div><span>SAÚDE &amp; BEM-ESTAR</span><strong>Escolhas com<br />mais clareza.</strong><small>Consultoria para sua realidade</small></div>
            <div className="visual-card card-mini"><span className="mini-dot" /> Atendimento consultivo <strong>Para você e sua empresa</strong></div>
            <div className="visual-leaf leaf-one" /><div className="visual-leaf leaf-two" />
          </div>
        </section>

        <section className="audience-strip" aria-label="Públicos atendidos">
          <div><span className="strip-icon">▦</span><span><strong>Empresas e CNPJ</strong><small>Soluções para negócios e equipes</small></span></div>
          <div><span className="strip-icon">♡</span><span><strong>Pessoas e famílias</strong><small>Alternativas conforme seu perfil</small></span></div>
          <div><span className="strip-icon">◇</span><span><strong>Escolha orientada</strong><small>Comparação clara de condições</small></span></div>
        </section>

        <section className="section services-section" id="empresarial">
          <div className="section-heading"><span className="eyebrow">PARA SUA EMPRESA</span><h2>Benefícios pensados para a realidade do seu negócio.</h2><p>Uma escolha bem orientada começa por entender a empresa, as pessoas e as condições de contratação disponíveis.</p></div>
          <div className="service-layout">
            <div className="service-art business-art"><div className="art-circle"><div className="art-building"><span /><span /><span /><span /><span /><span /></div></div><div className="art-label"><span>01</span> Consultoria empresarial</div></div>
            <div className="service-content"><p className="service-intro">A M.S Consultoria ajuda empresas, MEIs e profissionais com CNPJ a avaliar alternativas de planos de saúde conforme o perfil do negócio e dos beneficiários.</p>
              <ul className="feature-list"><li><span>✓</span> Análise do perfil da empresa e dos beneficiários</li><li><span>✓</span> Comparação das opções disponíveis</li><li><span>✓</span> Avaliação de rede credenciada e abrangência</li><li><span>✓</span> Análise de preços, coparticipação e carências</li><li><span>✓</span> Orientação durante o processo de contratação</li></ul>
              <p className="fine-print">A elegibilidade, a quantidade mínima de vidas, a documentação e as condições dependem das regras de cada operadora e produto.</p>
              <a className="text-link" href={whatsappUrl('Olá! Gostaria de uma cotação de plano de saúde empresarial.')} target="_blank" rel="noreferrer">Solicitar cotação empresarial <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="section family-section" id="individual-familiar">
          <div className="family-copy"><span className="eyebrow">PARA VOCÊ E SUA FAMÍLIA</span><h2>Cuidado para quem importa, com orientação em cada escolha.</h2><p>Encontrar um plano exige atenção à rede credenciada, região de atendimento, acomodação, coparticipação e condições contratuais. Ajudamos você a entender as alternativas disponíveis.</p><a className="button" href={whatsappUrl('Olá! Gostaria de conhecer opções de planos de saúde individual ou familiar.')} target="_blank" rel="noreferrer">Consultar opções <span>↗</span></a></div>
          <div className="family-visual"><div className="family-ring ring-a" /><div className="family-ring ring-b" /><div className="family-symbol">♡</div><div className="family-caption"><strong>Uma escolha mais consciente</strong><span>Alternativas conforme perfil e disponibilidade</span></div></div>
        </section>

        <section className="section process-section">
          <div className="section-heading centered"><span className="eyebrow">COMO FUNCIONA</span><h2>Orientação em cada etapa.</h2><p>Um processo simples para entender as opções e comparar as condições com mais clareza.</p></div>
          <div className="steps-grid"><article className="step-card"><span className="step-number">01</span><div className="step-icon">◎</div><h3>Entendemos seu perfil</h3><p>Conhecemos suas necessidades, região de atendimento e características dos beneficiários.</p></article><article className="step-card"><span className="step-number">02</span><div className="step-icon">⌕</div><h3>Avaliamos alternativas</h3><p>Verificamos as opções disponíveis para o perfil apresentado.</p></article><article className="step-card"><span className="step-number">03</span><div className="step-icon">≋</div><h3>Comparamos condições</h3><p>Analisamos rede, cobertura, valores, carências e regras contratuais.</p></article><article className="step-card"><span className="step-number">04</span><div className="step-icon">✓</div><h3>Orientamos sua escolha</h3><p>Ajudamos você a compreender a proposta antes de prosseguir.</p></article></div>
        </section>

        <section className="section about-section" id="sobre"><div className="about-mark"><img src="/logo-ms.jpg" alt="M.S Consultoria" /></div><div className="about-copy"><span className="eyebrow">SOBRE A M.S CONSULTORIA</span><h2>Mais clareza para escolher. Mais segurança para decidir.</h2><p>Somos uma consultoria voltada à orientação na escolha de planos de saúde e benefícios empresariais. Nosso objetivo é ajudar pessoas, famílias e empresas a compreender e comparar as alternativas disponíveis de acordo com suas necessidades.</p><p>Com atendimento consultivo, buscamos tornar a análise das propostas mais clara, transparente e alinhada ao perfil de cada cliente.</p><a className="text-link" href="#contato">Converse com a nossa consultoria <span>↗</span></a></div></section>

        <section className="section contact-section" id="contato"><div className="contact-panel"><div className="contact-copy"><span className="eyebrow eyebrow-light">VAMOS CONVERSAR?</span><h2>Vamos encontrar uma opção adequada ao seu perfil?</h2><p>Converse com a M.S Consultoria e receba orientação para avaliar as alternativas disponíveis para você, sua família ou sua empresa.</p><a className="button button-gold" href={whatsappUrl('Olá! Gostaria de conversar com a M.S Consultoria sobre planos de saúde.')} target="_blank" rel="noreferrer">Falar com um consultor pelo WhatsApp <span>↗</span></a><div className="contact-details"><a href="tel:+5519920003380">☎ (19) 92000-3380</a><a href={`mailto:${EMAIL}`}>✉ {EMAIL}</a></div></div><form className="lead-form" onSubmit={submitForm}><h3>Solicite uma orientação</h3><p>Preencha os dados para iniciar o atendimento pelo WhatsApp.</p><label>Nome<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Como podemos chamar você?" /></label><label>Telefone / WhatsApp<input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" /></label><label>Tenho interesse em<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Plano empresarial (CNPJ)</option><option>Plano individual ou familiar</option><option>Quero tirar dúvidas</option></select></label><label>Cidade e estado<input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Ex.: Nova Odessa - SP" /></label><p className="form-privacy">Ao continuar, seus dados serão utilizados para responder à sua solicitação. Consulte nossa <button type="button" className="inline-link" onClick={() => setModal('privacy')}>Política de Privacidade</button>.</p><button className="button form-submit" type="submit">Continuar pelo WhatsApp <span>↗</span></button></form></div></section>
      </main>

      <footer className="site-footer"><div className="footer-top"><div className="footer-brand"><img src="/logo-ms.jpg" alt="Logo M.S Consultoria" /><p>Saúde e Benefícios Empresariais.</p></div><div className="footer-column"><h4>Explore</h4><a href="#empresarial">Planos empresariais</a><a href="#individual-familiar">Planos individuais e familiares</a><a href="#sobre">Sobre nós</a></div><div className="footer-column"><h4>Fale conosco</h4><a href={whatsappUrl('Olá! Gostaria de falar com a M.S Consultoria.')} target="_blank" rel="noreferrer">WhatsApp: (19) 92000-3380</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a><p>{ADDRESS}</p></div><div className="footer-column"><h4>Privacidade</h4><button onClick={() => setModal('privacy')}>Política de Privacidade</button><button onClick={() => setModal('cookies')}>Política de Cookies</button><button onClick={openPreferences}>Preferências de cookies</button></div></div><div className="footer-legal"><p><strong>M.S Consultoria</strong> · CNPJ {CNPJ}</p><p>As condições de contratação, elegibilidade, coberturas, carências, rede credenciada e valores dependem do produto, da operadora e das regras aplicáveis. As informações apresentadas têm caráter informativo e não substituem as condições contratuais.</p><span>© {new Date().getFullYear()} M.S Consultoria. Todos os direitos reservados.</span></div></footer>

      <a className="whatsapp-float" href={whatsappUrl('Olá! Acessei o site da M.S Consultoria e gostaria de mais informações.')} target="_blank" rel="noreferrer" aria-label="Falar com a M.S Consultoria pelo WhatsApp"><span>◔</span><small>Fale conosco</small></a>

      {bannerVisible && <div className="cookie-banner" role="dialog" aria-label="Preferências de cookies"><div className="cookie-text"><strong>Sua privacidade é importante para nós</strong><p>Utilizamos cookies necessários para o funcionamento do site. Com sua autorização, quando aplicável, também podemos utilizar cookies de estatísticas e publicidade. Você pode aceitar todos, rejeitar os opcionais ou personalizar suas preferências.</p><div className="cookie-links"><button onClick={() => setModal('privacy')}>Política de Privacidade</button><button onClick={() => setModal('cookies')}>Política de Cookies</button></div></div><div className="cookie-actions"><button className="cookie-primary" onClick={() => saveConsent({ necessary: true, preferences: true, analytics: true, marketing: true, savedAt: '' })}>Aceitar todos</button><button className="cookie-secondary" onClick={() => saveConsent(DEFAULT_CONSENT)}>Rejeitar opcionais</button><button className="cookie-tertiary" onClick={openPreferences}>Personalizar cookies</button></div></div>}

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModal(null); }}><section className="modal-card" role="dialog" aria-modal="true" aria-label={modal === 'preferences' ? 'Preferências de cookies' : modal === 'privacy' ? 'Política de Privacidade' : 'Política de Cookies'}><button className="modal-close" aria-label="Fechar" onClick={() => setModal(null)}>×</button>
        {modal === 'preferences' && <><span className="eyebrow">CONTROLE DE PRIVACIDADE</span><h2>Preferências de cookies</h2><p>Escolha quais categorias opcionais deseja permitir. Os cookies estritamente necessários permanecem ativos para o funcionamento do site.</p><div className="preference-row"><div><strong>Necessários</strong><p>Essenciais para funcionamento e segurança.</p></div><span className="always-on">Sempre ativos</span></div><PreferenceToggle title="Preferências" description="Lembrar configurações e escolhas do visitante." checked={draft.preferences} onChange={v => setDraft({ ...draft, preferences: v })} /><PreferenceToggle title="Estatísticas" description="Ajudar a entender a navegação e o desempenho." checked={draft.analytics} onChange={v => setDraft({ ...draft, analytics: v })} /><PreferenceToggle title="Marketing e publicidade" description="Medição de campanhas e publicidade personalizada, quando configuradas." checked={draft.marketing} onChange={v => setDraft({ ...draft, marketing: v })} /><div className="modal-actions"><button className="button button-outline" onClick={() => saveConsent(DEFAULT_CONSENT)}>Rejeitar opcionais</button><button className="button" onClick={() => saveConsent(draft)}>Salvar preferências</button></div></>}
        {modal === 'privacy' && <><span className="eyebrow">PRIVACIDADE E DADOS</span><h2>Política de Privacidade</h2><p>A M.S Consultoria utiliza os dados fornecidos voluntariamente pelos visitantes para responder a solicitações de contato e cotação, prestar atendimento e dar andamento às conversas iniciadas pelo próprio interessado.</p><h3>Quais dados podem ser tratados?</h3><p>Nome, telefone/WhatsApp, cidade, tipo de interesse e conteúdo enviado pelo visitante. Evite enviar informações médicas ou documentos pessoais pelo formulário inicial.</p><h3>Como os dados são utilizados?</h3><p>Os dados são utilizados para responder à solicitação, orientar o atendimento comercial, manter comunicações relacionadas ao pedido e cumprir obrigações aplicáveis. O WhatsApp e o provedor de e-mail possuem suas próprias políticas de privacidade quando esses serviços são utilizados.</p><h3>Compartilhamento e conservação</h3><p>Os dados podem ser tratados por prestadores necessários à comunicação ou operação do site, quando aplicável. O período de conservação deve considerar a finalidade, a necessidade e as obrigações legais pertinentes.</p><h3>Seus direitos e contato</h3><p>Você pode solicitar informações sobre seus dados, correção ou outras providências aplicáveis pela LGPD entrando em contato pelo e-mail <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p><p><strong>Nota:</strong> esta versão inicial deve ser revisada para refletir todos os serviços, fornecedores e processos efetivamente utilizados antes da publicação definitiva.</p></>}
        {modal === 'cookies' && <><span className="eyebrow">COOKIES E PREFERÊNCIAS</span><h2>Política de Cookies</h2><p>Cookies e tecnologias semelhantes podem armazenar preferências ou auxiliar no funcionamento e na medição de um site. Este projeto inclui um painel para registrar as escolhas do visitante.</p><h3>Categorias</h3><p><strong>Necessários:</strong> funções essenciais e segurança. <strong>Preferências:</strong> configurações do visitante. <strong>Estatísticas:</strong> análise de navegação. <strong>Marketing:</strong> medição de campanhas e publicidade, quando aplicável.</p><h3>Como gerenciar</h3><p>Use o link “Preferências de cookies” no rodapé para alterar ou retirar suas escolhas. As categorias opcionais devem permanecer desativadas até o consentimento aplicável.</p><h3>Ferramentas externas</h3><p>O código inicial não carrega Google Analytics, Google Ads, pixels ou outras ferramentas de rastreamento. Caso sejam adicionadas, esta política deverá ser atualizada com os fornecedores, finalidades e prazos reais, e os scripts deverão ser integrados ao sistema de consentimento.</p><p><strong>Nota:</strong> revisar esta política antes da publicação e atualizá-la conforme as ferramentas efetivamente instaladas.</p></>}
      </section></div>}
    </div>
  );
}

function PreferenceToggle({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="preference-row"><div><strong>{title}</strong><p>{description}</p></div><button type="button" className={checked ? 'toggle is-on' : 'toggle'} role="switch" aria-checked={checked} aria-label={title} onClick={() => onChange(!checked)}><span /></button></div>;
}