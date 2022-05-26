const mongoose = require('mongoose')

const model = new mongoose.Schema(
    {
    guilId: { type: String },
    lang: { type: String }
    },
    {
        collection: 'Guilds' 
    }
)

module.exports = mongoose.model('Guilds', model)