const mongoose = require('mongoose');
const config = require('../config');

const mongo = config.get('mongo');
mongoose.connect(mongo);
