import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        let pageContext;
        const page = ctx.renderPage((Component) => {
            const WrappedComponent = (props) => {
                pageContext = props.pageContext;
                return <Component {...props} />;
            };
            return WrappedComponent;
        });

        let css;
        if (pageContext) {
            css = pageContext.sheetsRegistry.toString();
        }

        return {
            ...page,
            pageContext,
            styles: (
                <React.Fragment>
                    <style id="jss-server-side" dangerouslySetInnerHTML={{ __html: css }} />
                    {flush() || null}
                </React.Fragment>
            )
        };
    }

    render() {
        return (
            <html>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="full-screen" content="yes" />
                    <meta name="browsermode" content="application" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no,maximum-scale=1.0" />
                    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                    {/* <link rel="manifest" href="/static/manifest.json" /> */}
                    <style>{`html,body{
                        margin: 0;
                        padding: 0;
                        width: 100vw;
                        height: 100vh;
                        font-size: 16px;
                        -webkit-overflow-scrolling: touch;
                    }`}</style>
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
