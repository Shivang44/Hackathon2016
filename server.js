const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Path = require('path');
const Hoek = require('hoek');
const Handlebars = require('handlebars');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    port: process.env.PORT
});

server.register(Inert, (err) => {

    if (err) {
      
        throw err;
    }

});

server.register(Vision, (err) => {
    Hoek.assert(!err, err);
    server.views({
        engines: {
            html: Handlebars // We will be using handlebars for rendering templates
        },
        relativeTo: __dirname,
        path: 'templates'
    });
});


// Add the route
server.route(require('./routes.js'));





// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    //console.log('Server running at:', server.info.uri);
});

