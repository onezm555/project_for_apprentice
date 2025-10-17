const express = require('express');
const router = express.Router();
const {read,list,create,update,remove} = require('../Controllers/product');

router.get('/products', list);
router.get('/products/:id', read);
router.post('/products', create);
router.put('/products', update);
router.put('/products/:id', update);
router.delete('/products', remove);


module.exports = router;