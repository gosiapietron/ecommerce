var mongoose  = require('mongoose'),
	 Schema  = mongoose.Schema,
	 user    = require('./user')

var	 mySchema = new Schema({
		  name:String,
		  price:String,
		  quantity:Number,
		  availability:String,
	user:{type: mongoose.Schema.Types.ObjectId, ref: 'salame fresco'}
	});

var myPurchases = mongoose.model("myPurchases", mySchema)
module.exports = myPurchases