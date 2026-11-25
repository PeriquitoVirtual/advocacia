const destinationKeys = {
  criminal: 'criminal',
  trabalhista: 'trabalho',
};

export default function initAreaLanding() {
  const requestedArea = new URLSearchParams(window.location.search).get('area')?.trim().toLowerCase();
  const areaKey = destinationKeys[requestedArea];
  if (!areaKey) return;

  const openAreaModal = () => {
    const dialog = document.getElementById('area-modal');
    const saibaMais = document.querySelector(`#areas [data-area="${areaKey}"]`);
    if (!dialog || !saibaMais) return false;
    if (!dialog.open) saibaMais.click();
    return true;
  };

  if (openAreaModal()) return;

  // Wait until the existing area section and modal are initialized.
  const observer = new MutationObserver(() => {
    if (openAreaModal()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 15000);
}
