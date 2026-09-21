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
  requestForm.noValidate = true;
  const submitButton = requestForm.querySelector('[type="submit"]');
  let submitting = false;
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
  requestForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    const invalidFields = fields.filter(field => !validateField(field));
    if (invalidFields.length) {
      status.hidden = true;
      invalidFields[0].focus();
      return;
    }
    submitting = true;
    submitButton.disabled = true;
    status.hidden = true;
    try {
      // Prepare the existing template before sending, while errors can still
      // be displayed in the intact form. Keep its card styling unchanged.
      const template = document.getElementById('diagnostic-success-message');
      const confirmationCard = document.createElement('div');
      confirmationCard.className = requestForm.className;
      confirmationCard.appendChild(template.content.cloneNode(true));
      const confirmation = confirmationCard.querySelector('.request-confirmation');
      if (!confirmation) throw new Error('Missing confirmation message');

      const response = await fetch(requestForm.action, {
        method: 'POST',
        body: new FormData(requestForm),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission failed');
      requestForm.replaceWith(confirmationCard);
      confirmation.focus();
    } catch (error) {
      status.textContent = 'Votre demande n’a pas pu être envoyée. Veuillez réessayer dans quelques instants.';
      status.hidden = false;
      status.focus();
    } finally {
      submitting = false;
      submitButton.disabled = false;
    }
  });
}
