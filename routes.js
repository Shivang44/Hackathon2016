var routes = [
  {
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: 'public/'
            }
        }
  },
  
  {
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
      reply.file('views/index.html');
    }
  }, 
  {
    method: 'GET',
    path:'/view', 
    handler: function (request, reply) {
      reply.file('views/view.html');
    }
  }
];

module.exports = routes;