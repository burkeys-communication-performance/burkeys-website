const btn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));
}

const requestForm = document.querySelector('#diagnostic-request-form');
if (requestForm) {
  // No endpoint is configured. Never transmit data or display a success state.
  // diagnostic-success-message is an inert template for a future confirmed response.
  requestForm.noValidate = true;
  requestForm.querySelector('[type="submit"]').disabled = false;
  const fields = [...requestForm.querySelectorAll('input, textarea')];
  const status = requestForm.querySelector('.request-status');
  function validateField(field) {
    let message = '';
    if (!field.value.trim()) message = 'Veuillez renseigner ce champ.';
    else if (field.type === 'email' && !field.validity.valid) message = 'Veuillez saisir une adresse email valide.';
    const error = document.getElementById(`${field.id}-error`);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
    error.hidden = !message;
    return !message;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (field.hasAttribute('aria-invalid')) validateField(field);
    status.hidden = true;
  }));
  requestForm.addEventListener('submit', event => {
    event.preventDefault();
    const invalidFields = fields.filter(field => !validateField(field));
    if (invalidFields.length) {
      status.hidden = true;
      invalidFields[0].focus();
      return;
    }
    status.textContent = 'Votre demande n’a pas été envoyée : le formulaire doit encore être connecté.';
    status.hidden = false;
    status.focus();
  });
}
