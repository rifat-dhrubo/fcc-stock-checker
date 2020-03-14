const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
	companyName: {
		type: String,
		min: 2,
		required: 'company name have to provided',
	},
	ip: {
		type: [String],
		required: 'user must have an ip address',
	},
	likes: Number,
});

stockSchema.statics.getLikesCount = function(name) {
	return this.aggregate([
		{ $match: { companyName: name } },
		{
			$project: {
				_id: 0,
				companyName: '$companyName',
				likesCount: { $size: { $ifNull: ['$ip', []] } },
			},
		},
	]).exec();
};

module.exports = mongoose.model('Stock', stockSchema);
