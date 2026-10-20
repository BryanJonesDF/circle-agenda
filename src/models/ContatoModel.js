const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body, userId) {
    this.body = body;
    this.userId = userId;
    this.errors = [];
    this.contato = null;
  }

  // ===== Métodos estáticos: agora todos recebem o userId =====

  static async buscaPorId(id, userId) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOne({ _id: id, criadoPor: userId });
    return contato;
  }

  static async buscaContatos(userId) {
    const contatos = await ContatoModel.find({ criadoPor: userId }).sort({ criadoEm: -1 });
    return contatos;
  }

  static async delete(id, userId) {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findOneAndDelete({ _id: id, criadoPor: userId });
    return contato;
  }

  // ===== Métodos de instância =====

  async register() {
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.create({ ...this.body, criadoPor: this.userId });
  }

  async edit(id) {
    if (typeof id !== 'string') return;
    this.valida();
    if (this.errors.length > 0) return;
    this.contato = await ContatoModel.findOneAndUpdate(
      { _id: id, criadoPor: this.userId },
      this.body,
      { new: true }
    );
  }

  valida() {
    this.cleanUp();

    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.errors.push('E-mail inválido.');
    }

    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório.');

    if (!this.body.email && !this.body.telefone) {
      this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    };
  }
}

module.exports = Contato;