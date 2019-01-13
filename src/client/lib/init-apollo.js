import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import fetch from 'cross-fetch';
let apolloClient = null;

if (!process.browser || !('fetch' in global) || typeof global.fetch !== 'function') {
    global.fetch = fetch;
}

function create(initialState) {
    return new ApolloClient({
        connectToDevTools: process.browser,
        ssrMode: !process.browser,
        link: new HttpLink({
            uri: process.env.NODE_ENV === 'production' ? `${process.env.SERVER_URI}/graphql` : 'http://localhost:8080/graphql',
            credentials: 'same-origin'
        }),
        cache: new InMemoryCache().restore(initialState || {})
    });
}

export default function initApollo(initialState) {
    if (!process.browser) {
        return create(initialState);
    }

    if (!apolloClient) {
        apolloClient = create(initialState);
    }

    return apolloClient;
}
