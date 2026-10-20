const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
  try {
    let contatos = [];

    if (req.session.user) {
      contatos = await Contato.buscaContatos(req.session.user._id);
    }

    res.render('index', { contatos });
  } catch (e) {
    console.log(e);
    return res.render('404');
  }
};