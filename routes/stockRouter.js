const express = require('express');
const router = express.Router();

router.route('/api/stock-prices').get(function(req, res) {
	res.send('hello');
});

module.exports = router;
