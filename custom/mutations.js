
const { merge, concat } = require('ramda');

// This file is meant for examples and tests
// For custom usage you are meant to provide your own


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

module.export = {
  mutations,
  defaultStore
}
