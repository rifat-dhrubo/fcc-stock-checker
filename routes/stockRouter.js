const express = require('express');
const router = express.Router();
const axios = require('axios');
const { asyncHandler } = require('../utils/handles');
const Stock = require('../models/Stock');

const makeStockQuery = (companyName, like, ip) => {
	if (like === 'true') {
		return Stock.findOneAndUpdate(
			{ companyName },
			{ companyName, $addToSet: { ip: ip } },
			{ new: true, upsert: true }
		)
			.select({ companyName: 1 })
			.lean()
			.exec();
	} else {
		return Stock.findOneAndUpdate(
			{ companyName },
			{ companyName },
			{
				new: true,
				upsert: true,
			}
		)
			.select({ companyName: 1 })
			.lean()
			.exec();
	}
};

router
	.route('/')
	.get(async (req, res, next) => {
		// query destructuring
		let { stock: stockName, like } = req.query;
		const ip = req.ip;

		if (typeof stockName === 'object') {
			next();
			return;
		}

		const URI = `https://repeated-alpaca.glitch.me/v1/stock/${stockName}/quote`;

		// making price and database queries
		const [errData, allData] = await asyncHandler(
			Promise.all([
				axios.get(URI),
				makeStockQuery(stockName, like, ip), // sets like in db if ip is unique
				Stock.getLikesCount(stockName),
			])
		);

		// Error handling
		if (errData) {
			res.json(errData);
			return;
		}

		const [response, , [firstData] = companyInfo] = allData;

		// simplifying the api data
		const {
			data: { latestPrice: price },
		} = response;

		res.json({ stockData: { ...firstData, price } });
	})
	.get(async (req, res, next) => {
		// query destructuring
		const { stock, like } = req.query;
		[firstName, secondName] = stock;
		const ip = req.ip;

		const firstURI = `https://repeated-alpaca.glitch.me/v1/stock/${firstName}/quote`;
		const secondURI = `https://repeated-alpaca.glitch.me/v1/stock/${secondName}/quote`;

		// making price and database queries
		const [errData, allData] = await asyncHandler(
			Promise.all([
				axios.get(firstURI),
				axios.get(secondURI),
				makeStockQuery(firstName, like, ip),
				makeStockQuery(secondName, like, ip),
				Stock.getLikesCount(firstName),
				Stock.getLikesCount(secondName),
			])
		);

		// destructuring from Promise.all
		const [
			responseFirst,
			responseSecond,
			,
			,
			[firstData] = firstCompanyInfo,
			[secondData] = secondCompanyInfo,
		] = allData;

		//simplifying the api data
		const {
			data: { latestPrice: priceFirst },
		} = responseFirst;

		const {
			data: { latestPrice: priceSecond },
		} = responseSecond;

		// Error handling
		if (errData) {
			res.json(errData);
			return;
		}

		// massaging the data
		firstData['rel_likes'] = firstData['likesCount'] - secondData['likesCount'];
		secondData['rel_likes'] = secondData['likesCount'] - firstData['likesCount'];

		const { likesCount: firstLikesCount, ...firstCompanyData } = firstData;
		const { likesCount: secondLikesCount, ...secondCompanyData } = secondData;

		res.json({
			stockData: [
				{ ...firstCompanyData, priceFirst },
				{ ...secondCompanyData, priceSecond },
			],
		});
	});

module.exports = router;
