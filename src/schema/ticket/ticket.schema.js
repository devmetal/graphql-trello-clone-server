const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types } = Schema;

const ticketSchema = Schema({
  label: String,
  body: String,
  created: Date,
  board: {
    type: Types.ObjectId,
    ref: 'Board',
  },
  removed: {
    type: Boolean,
    default: false,
  },
  comments: [
    {
      type: Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

ticketSchema.methods.getBoard = function getBoard() {
  return mongoose.model('Board').findById(this.board);
};

ticketSchema.methods.getComments = function getComments() {
  return mongoose
    .model('Comment')
    .find({
      _id: { $in: this.comments },
      removed: false,
    })
    .sort({ _id: -1 });
};

mongoose.model('Ticket', ticketSchema);
