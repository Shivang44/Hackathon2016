const Hapi = require('hapi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT 
});

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

});






// Add the route
server.route(require('./routes.js'));














// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});

