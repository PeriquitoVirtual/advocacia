const dialog = document.createElement('dialog');
dialog.className = 'privacidade-modal';
dialog.setAttribute('aria-labelledby', 'privacidade-modal-titulo');
dialog.setAttribute('data-lenis-prevent', '');
dialog.innerHTML = `<div class="privacidade-modal__barra"><h2 id="privacidade-modal-titulo">Política de privacidade</h2><button type="button" aria-label="Fechar política de privacidade">✕</button></div><div class="privacidade-modal__conteudo" aria-live="polite"></div>`;
document.body.append(dialog);
const content = dialog.querySelector('.privacidade-modal__conteudo');
let loaded = false;
let previousOverflow = '';
dialog.querySelector('button').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; });
document.addEventListener('click', async event => {
  const link = event.target.closest?.('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || !url.pathname.endsWith('/privacidade.html')) return;
  event.preventDefault();
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialog.showModal();
  if (loaded) return;
  content.textContent = 'Carregando política de privacidade…';
  try {
    const response = await fetch(url.href);
    if (!response.ok) throw new Error('Não foi possível carregar');
    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const main = page.querySelector('main');
    if (!main) throw new Error('Conteúdo indisponível');
    main.querySelectorAll('.marca, h1, footer, script').forEach(el => el.remove());
    content.replaceChildren(...main.childNodes);
    loaded = true;
  } catch {
    content.innerHTML = '<p>Não foi possível carregar a política. <a href="./privacidade.html" target="_blank" rel="noopener">Abrir a política em outra aba</a>.</p>';
  }
});
