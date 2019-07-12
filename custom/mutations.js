
const { merge, concat } = require('ramda');

const mutations = {
  newElement: (state, {text, id}) => ({
    elements: merge(state.elements, { [id]: { text: text, id: id } }),
    elementsIds: concat([id], state.elementsIds),
  })
};

const defaultStore = {
  elements: {},
  elementsIds: [],
};

exports.defaultStore = defaultStore;
exports.mutations = mutations;
