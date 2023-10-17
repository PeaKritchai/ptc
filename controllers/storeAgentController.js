const Agent = require('../models/Agent')

module.exports = (req, res) => {
    Agent.create(req.body).then(() => {
        console.log("User registered successfully!")
        res.redirect('/success')
    }).catch((error) => {
        // console.log(error.errors)

        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('validationErrors', validationErrors)
            req.flash('data', req.body)
            return res.redirect('/')
        }
    })
}