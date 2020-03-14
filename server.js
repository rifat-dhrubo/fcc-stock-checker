const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
require('dotenv').config();
const path = require('path');
const stockRouter = require('./routes/stockRouter');
const helmet = require('helmet');

const app = express();

app.use(bodyParser.json());
app.use(helmet());

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'"],
		},
	})
);

app.use(bodyParser.urlencoded({ extended: true }));

// setting up the static folder
app.use(express.static(path.join(__dirname, 'public')));

// pointing to the view folder
app.set('views', path.join(__dirname, 'views'));

// render engine
app.set('view engine', 'ejs');

app.use(cors({ origin: '*' })); //For FCC testing purposes only

//Index page (static HTML)
app.route('/').get(function(req, res) {
	res.render('index');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
app.use('/api/stock-prices', stockRouter);

//404 Not Found Middleware
app.use(function(req, res, next) {
	res.status(404)
		.type('text')
		.send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + process.env.PORT);
	try {
		mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log(`connected to database`);
	} catch (err) {
		console.log(`database connection error`);
		console.error(err);
	}
	if (process.env.NODE_ENV === 'test') {
		console.log('Running Tests...');
		setTimeout(function() {
			try {
				runner.run();
			} catch (e) {
				const error = e;
				console.log('Tests are not valid:');
				console.log(error);
			}
		}, 1500);
	}
});

module.exports = app; //for unit/functional testing
