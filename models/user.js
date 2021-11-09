const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

    idCitizen: { type: String, required: true },
    firstname: String,
    lastname: String,
    phoneNumber: Number,
    emailAddress: String,
    birthdate: {
        type : Date,
        default : Date.now
    } ,
    gender: String,
    civilStatus: String,
    cin: Number,
    password: String,
    address: String
});

module.exports = mongoose.model("User", userSchema);