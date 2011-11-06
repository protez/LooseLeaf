//var persistence = require('../ext/persistencejs/lib/persistence').persistence;

module.exports = function(models) {

  this.index = function(req, res, next) {
  }
  
  this.create = function(req, res, next) {
    console.log(req.session.user);
    models.Post.save(req.body.post, req.session.user, function(err, post) {
      if (err) return next(err);
      res.send(JSON.stringify(post));
    });
  };

  this.loadPost = function(req, res, next, id) {
    console.log(id);
    models.Post.findById(id, function(err, post) {
      console.log(post);
      if (!post) return res.send(404);
      if (!req.session.user && post.isPrivate) return res.send(404);
      req.post = post;
      next();
    });
  };

  this.show = function(req, res, next) {
    res.render('posts/show', {
      title: req.post.title,
      posts: [req.post]
    });
  };
  
  this.edit = function(req, res, next) {
    if (req.post.user.username != req.session.user.username) return res.send(401);
    console.log('req post', req.body.post);
    for (var i in req.body.post) {
      if (req.body.post[i] == 'true') req.body.post[i] = true;
      if (req.body.post[i] == 'false') req.body.post[i] = false;
      req.post[i] = req.body.post[i];
    }
    console.log('editedPost', req.post);
    models.Post.save(req.post, null, function(err, post) {
      if (err) return next(err);
      res.send(JSON.stringify(post));
    });
  };

  this.destroy = function(req, res, next) {
    if (req.post.user.username != req.session.user.username) return res.send(401);
    models.Post.remove(req.post, function(err) {
      if (err) return next(err);
      res.send(200);
    });
  };

  return this;

}.bind({});
