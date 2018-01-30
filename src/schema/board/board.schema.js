const mongoose = require('mongoose');

const { Schema } = mongoose;

const boardSchema = Schema({
  label: String,
  removed: { type: Boolean, default: false },
});

boardSchema.methods.getTickets = function getTickets() {
  return mongoose.model('Ticket')
    .find({
      board: this._id,
      removed: false,
    })
    .sort({ created: 1 });
};

mongoose.model('Board', boardSchema);
