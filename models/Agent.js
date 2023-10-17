const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const AgentSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name']
    },
    email: {
        type: String,
        required: [true, 'Please provide email']
    },  
    phonenumber: {
        type: String,
        required: [true, 'Please provide phone']
    },   
    address: {
        type: String,
        required: [true, 'Please provide address']
    },
    province: {
        type: String,
        required: [true, 'Please provide province']
    },
    idCardFile: {
        filename: String,
        path: String,
    },
    bookBankFile: {
        filename: String,
        path: String,
    },
    acceptPDPA: {
        type: String,
        enum: ['Y', 'N'],
        required: true
    },
    confirmFlag: {
        type: String,
        enum: ['Y', 'N'],
        default: 'N'
    },
    dateRegister: {
        type: Date,
        default: Date.now // กำหนดให้มีค่าเริ่มต้นเป็นเวลาปัจจุบัน
    }
})

AgentSchema.pre('save', function(next) {
    const Agent = this
    next()
})






const Agent = mongoose.model('Agent', AgentSchema)
module.exports = Agent
