import   {sequelize} from '../models';
var express = require('express');
var router = express.Router();

/* GET home page. */
sequelize.sync().then(()=>{
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  });
  module.exports = router;
