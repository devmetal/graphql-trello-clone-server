const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types } = Schema;

const historyRecordSchema = Schema({
  dateTime: Date,
  item: { type: Types.ObjectId },
  itemType: {
    type: String,
    enum: ['board', 'comment'],
  },
});

historyRecordSchema.methods.getItem = function getItem() {
  switch (this.itemType) {
    case 'board':
      return mongoose.model('Board').findById(this.item);
    case 'comment':
      return mongoose.model('Comment').findById(this.item);
    default:
      return Promise.reject(new Error(`Invalid item type: ${this.itemType}`));
  }
};

mongoose.model('HistoryRecord');
