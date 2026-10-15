exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next()
}

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    console.log(err); // você vê o erro no terminal
    return res.render('404'); // o usuário vê a página 404
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken()
  next()
}
