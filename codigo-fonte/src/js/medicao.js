// Google Ads: modo básico. Nenhuma tag externa carrega antes da permissão.
const ADS_ID = 'AW-18420578557';
const CONVERSION = `${ADS_ID}/r01eCJG_2_EcEP3xzs9E`;
const KEY = 'izabella_consent_v1';
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
let enabled = false;
let loaded = false;

function readChoice() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return value && Date.now() - value.time < MAX_AGE && typeof value.allowed === 'boolean' ? value.allowed : null;
  } catch { return null; }
}

function google() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  return window.gtag;
}

function enable() {
  enabled = true;
  const gtag = google();
  if (!loaded) {
    gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('set', 'ads_data_redaction', true);
  }
  gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'denied', ad_user_data: 'granted', ad_personalization: 'denied' });
  if (loaded) return;
  loaded = true;
  gtag('js', new Date());
  gtag('config', ADS_ID, { allow_ad_personalization_signals: false });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  script.dataset.googleAds = '';
  document.head.append(script);
}

function disable() {
  enabled = false;
  if (loaded) google()('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!name.startsWith('_gcl_')) continue;
    for (const domain of ['', `;domain=${location.hostname}`, `;domain=.${location.hostname}`]) {
      document.cookie = `${name}=;max-age=0;path=/${domain};SameSite=Lax`;
    }
  }
}

export default function initMedicao() {
  const banner = document.createElement('aside');
  banner.className = 'consentimento';
  banner.setAttribute('aria-label', 'Preferências de medição');
  banner.innerHTML = `<p>Podemos usar o Google Ads para medir cliques no WhatsApp? A escolha é opcional. <a href="./privacidade.html">Entenda o uso dos dados</a>.</p><div class="consentimento__acoes"><button type="button" data-consent="deny">Somente necessários</button><button type="button" data-consent="allow">Permitir medição</button></div>`;
  document.body.append(banner);
  const choice = readChoice();
  banner.hidden = choice !== null;
  if (choice === true) enable();

  function choose(allowed) {
    try { localStorage.setItem(KEY, JSON.stringify({ allowed, time: Date.now() })); } catch { /* funciona também sem persistência */ }
    if (allowed) enable(); else disable();
    banner.hidden = true;
    document.querySelector('[data-consent-settings]')?.focus({ preventScroll: true });
  }
  banner.querySelector('[data-consent="deny"]').addEventListener('click', () => choose(false));
  banner.querySelector('[data-consent="allow"]').addEventListener('click', () => choose(true));
  document.querySelector('[data-consent-settings]')?.addEventListener('click', () => {
    banner.hidden = false;
    banner.querySelector('button').focus({ preventScroll: true });
  });

  // Um único listener delegado cobre cliques no texto, ícones e teclado.
  // Nunca impede a navegação ou aguarda a resposta da tag para abrir o contato.
  document.addEventListener('click', (event) => {
    const a = event.target instanceof Element ? event.target.closest('a[data-wa]') : null;
    if (!a || !enabled || event.defaultPrevented) return;
    google()('event', 'conversion', {
      send_to: CONVERSION,
      event_timeout: 2000,
      whatsapp_context: a.dataset.wa,
      section_id: a.closest('section')?.id || 'global',
    });
  });
}
