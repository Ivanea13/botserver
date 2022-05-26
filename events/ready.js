const mongoose = require('mongoose')
const config = require('../config.json')

module.exports = {
    name: 'ready',
    execute(client) {
        mongoose.connect(config.mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopoLogy: true
        })
        console.log('LISTO')
    }
}