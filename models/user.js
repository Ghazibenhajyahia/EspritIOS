const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({


    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        default: null,
    },
    emailAddress: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        default: Date.now,
    },
    gender: {
        type: String,
        default: "male",
    },
    civilStatus: {
        type: String,
        default: "single",
    },
    cin: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photoProfil: {
        type: String,
        required: false
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    },
    claims: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'claim'
    }],
    Municipalitys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipality'
    }]
});

/*
userSchema.pre('save', function() {
    const user = this;

})
*/

module.exports = mongoose.model("user", userSchema);