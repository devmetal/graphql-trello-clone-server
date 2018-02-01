const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types } = Schema;

const commentSchema = Schema({
  ticket: {
    type: Types.ObjectId,
    ref: 'Ticket',
  },
  removed: {
    type: Boolean,
    default: false,
  },
  body: String,
});

commentSchema.methods.getTicket = function getTicket() {
  return mongoose.model('Ticket').findById(this.ticket);
};

mongoose.model('Comment', commentSchema);
