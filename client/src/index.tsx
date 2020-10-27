import React from 'react';
import ReactDom from 'react-dom';
import {
    ApolloClient,
    NormalizedCacheObject,
    ApolloProvider,
    gql,
    useQuery,
} from '@apollo/client';

import { cache } from './cache';
import Pages from './pages';
import Login from './pages/login';
import injectStyles from './styles';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
    headers: {
        authorization: localStorage.getItem('token') || '',
        'client-name': 'Space Explorer [web]',
        'client-version': '1.0.0',
    },
    typeDefs,
    resolvers: {},
    connectToDevTools: true,
});


export const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);    
    return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();

ReactDom.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root'),
);