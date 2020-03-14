const express = require('express');
const router = express.Router();

const {
	singleQueryController,
	multipleQueryController,
} = require('../controllers/stockController');

router
	.route('/')
	.get(singleQueryController)
	.get(multipleQueryController);

module.exports = router;
