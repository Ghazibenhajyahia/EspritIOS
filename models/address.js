const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

    street : {type : String, required: true},
    city : String,
    state : String,
    postalCode : Number,
    country : String,
});

module.exports = mongoose.model("address",userSchema);