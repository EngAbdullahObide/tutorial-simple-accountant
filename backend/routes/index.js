var express = require('express');
var router = express.Router();
import   {sequelize} from '../models';

/* GET home page. */
sequelize.sync().then(()=>{
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  });
  module.exports = router;
