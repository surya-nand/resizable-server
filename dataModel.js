const mongoose = require('mongoose');


const componentData = mongoose.model('component', {
    value : String,
    count : Number,
})

module.exports = componentData;