/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	suite('GET /api/stock-prices => stockData object', function() {
		test('1 stock', function(done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.property(res.body, 'stockData', 'stockData should be a property');
					assert.property(
						res.body.stockData.companyName,
						'companyName',
						'stockData should have a company name'
					);
					assert.property(
						res.body.stockData.likesCount,
						'likesCount',
						'stockData should have a likes count'
					);
					assert.property(
						res.body.stockData.price,
						'price',
						'stockData should have a price'
					);
					assert.isAtLeast(req.body.likes, 0);
				});
			done();
		});

		test('1 stock with like', function(done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', likes: 'true' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.property(res.body, 'stockData', 'stockData should be a property');
					assert.property(
						res.body.stockData.companyName,
						'companyName',
						'stockData should have a company name'
					);
					assert.property(
						res.body.stockData.likesCount,
						'likesCount',
						'stockData should have a likes count'
					);
					assert.property(
						res.body.stockData.price,
						'price',
						'stockData should have a price'
					);
					assert.isAtLeast(req.body.likes, 1);
				});
			done();
		});

		test('1 stock with like again (ensure likes arent double counted)', function(done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.property(res.body, 'stockData', 'stockData should be a property');
					assert.property(
						res.body.stockData.companyName,
						'companyName',
						'stockData should have a company name'
					);
					assert.property(
						res.body.stockData.likesCount,
						'likesCount',
						'stockData should have a likes count'
					);
					assert.property(
						res.body.stockData.price,
						'price',
						'stockData should have a price'
					);
					assert.isAtLeast(req.body.likes, 1);
				});
			done();
		});

		test('2 stocks', function(done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', stock: 'msft' })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.isArray(res.body.stockData, 'stockData', 'stockData should be a array');
					assert.isObject(
						res.body.stockData[0],
						'companyName',
						'stockData should have a company name'
					);
					assert.isObject(
						res.body.stockData[1],
						'companyName',
						'stockData should have a company name'
					);
					assert.property(
						res.body.stockData[0].companyName,
						'companyName',
						'stockData should have a company name'
					);
					assert.property(
						res.body.stockData[0].rel_likes,
						'likesCount',
						'stockData should have a rel_likes'
					);
					assert.property(
						res.body.stockData[0].price,
						'price',
						'stockData should have a price'
					);
				});
			done();
		});

		test('2 stocks with like', function(done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: 'goog', stock: 'msft', likes: true })
				.end(function(err, res) {
					assert.equal(res.status, 200);
					assert.isObject(res.body, 'response should be an object');
					assert.isArray(res.body.stockData, 'stockData', 'stockData should be a array');
					assert.isObject(
						res.body.stockData[0],
						'companyName',
						'stockData should have a company name'
					);
					assert.isObject(
						res.body.stockData[1],
						'companyName',
						'stockData should have a company name'
					);
					assert.property(
						res.body.stockData[0].companyName,
						'companyName',
						'stockData should have a company name'
					);
					assert.property(
						res.body.stockData[0].rel_likes,
						'likesCount',
						'stockData should have a rel_likes'
					);
					assert.property(
						res.body.stockData[0].price,
						'price',
						'stockData should have a price'
					);
				});
			done();
		});
	});
});
