const details = document.getElementById('model-details');

function openModelDetails() {
  if (!details) return;
  details.open = true;
  details.scrollIntoView({ block: 'start', behavior: 'instant' });
  details.querySelector('summary')?.focus({ preventScroll: true });
}

document.querySelectorAll('a[href="#model-details"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    if (window.location.hash !== '#model-details') {
      window.history.pushState(null, '', '#model-details');
    }
    openModelDetails();
  });
});

function openFromHash() {
  if (window.location.hash === '#model-details') openModelDetails();
}

window.addEventListener('hashchange', openFromHash);
openFromHash();
