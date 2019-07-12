const privateRoutes = {
  'GET /users': 'UserController.getAll',
  'GET /get-state': 'UserController.getState',
  'POST /apply': 'UserController.bulkApply',
};

module.exports = privateRoutes;
