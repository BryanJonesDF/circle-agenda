import validator from 'validator';

export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate();
    });
  }

  validate() {
    const emailInput = this.form.querySelector('input[name="email"]');
    const passwordInput = this.form.querySelector('input[name="password"]');
    let error = false;

    this.limpaErros();

    if (!validator.isEmail(emailInput.value)) {
      this.criaErro(emailInput, 'E-mail inválido.');
      error = true;
    }

    if (passwordInput.value.length < 3 || passwordInput.value.length > 50) {
      this.criaErro(passwordInput, 'A senha precisa ter entre 3 e 50 caracteres.');
      error = true;
    }

    if (!error) this.form.submit();
  }

  criaErro(input, msg) {
    input.classList.add('is-invalid');
    const div = document.createElement('div');
    div.classList.add('invalid-feedback');
    div.innerText = msg;
    input.insertAdjacentElement('afterend', div);
  }

  limpaErros() {
    this.form.querySelectorAll('.invalid-feedback').forEach((div) => div.remove());
    this.form.querySelectorAll('.is-invalid').forEach((input) => input.classList.remove('is-invalid'));
  }
}