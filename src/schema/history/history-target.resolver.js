module.exports = {
  __resolveType(obj) {
    if (obj.label) {
      return 'Board';
    }
    return 'Comment';
  },
};
