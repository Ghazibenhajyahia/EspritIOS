const mongoose = require('mongoose')

const claimSchema = new mongoose.Schema({

    name : {
        type : String
    },
    type : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now
    },
    image : {
        type : String,
        default : null
    },
    text : {
        type : String,
        default : null
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
})

module.exports = mongoose.model("claim", claimSchema);