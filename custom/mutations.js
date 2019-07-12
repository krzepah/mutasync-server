
const { merge, concat } = require('ramda');

const mutations = {
  newElement: (state, {text, id}) => ({
    elements: merge(state.elements, { ...text, ...id }),
    elementsIds: concat([id], elementsIds),
  })
};

const defaultStore = {
  elements: {},
  elementsIds: [],
};

exports.defaultStore = defaultStore;
exports.mutations = mutations;
