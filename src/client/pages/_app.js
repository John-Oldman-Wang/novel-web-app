import React from 'react';
import App, { Container } from 'next/app';

import withApolloClient from '../lib/with-apollo-client';
import { ApolloProvider } from 'react-apollo';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import JssProvider from 'react-jss/lib/JssProvider';
import getPageContext from '../lib/getPageContext';

class MyApp extends App {
    constructor() {
        super();
        this.pageContext = getPageContext();
    }

    render() {
        const { Component, pageProps, apolloClient, router } = this.props;
        return (
            <Container>
                <JssProvider registry={this.pageContext.sheetsRegistry} generateClassName={this.pageContext.generateClassName}>
                    <MuiThemeProvider theme={this.pageContext.theme} sheetsManager={this.pageContext.sheetsManager}>
                        <CssBaseline />
                        <ApolloProvider client={apolloClient}>
                            <Component pageContext={this.pageContext} {...pageProps} router={router} s="s" />
                        </ApolloProvider>
                    </MuiThemeProvider>
                </JssProvider>
            </Container>
        );
    }
}

export default withApolloClient(MyApp);
