const graphqlHttp = require('express-graphql');
const graphQlSchema = require('./schema/index');
const graphQlResolvers = require('./resolvers/index.js');

module.exports = function(app, dev) {
    const isDev = typeof dev === 'boolean' ? dev : process.env.NODE_ENV !== 'production';
    if (isDev) {
        app.use(
            '/graphql',
            graphqlHttp({
                schema: graphQlSchema,
                rootValue: graphQlResolvers,
                graphiql: true
            })
        );
    } else {
        app.post(
            '/graphql',
            graphqlHttp({
                schema: graphQlSchema,
                rootValue: graphQlResolvers,
                graphiql: false
            })
        );
    }

    return app;
};
