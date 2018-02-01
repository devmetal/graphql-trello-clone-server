const mongoose = require('mongoose');
const config = require('../config');

const mongo = config.get('mogno');
mongoose.connect(mongo);
