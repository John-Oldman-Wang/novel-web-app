import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SpeedMenu from '../components/speedMenu';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const styles = () => ({
    root: {
        backgroundImage: `linear-gradient`
    },
    content: {
        fontFamily: 'sans-serif',
        padding: `10px 10px 10px`
    },
    title: {
        fontWeight: 900,
        margin: '1.5rem 0'
    },
    contentItem: {
        lineHeight: '1.8',
        fontSize: '1.25rem',
        textIndent: '1.5em'
    }
});

class Chapter extends Component {
    render() {
        const { classes, data, error, loading } = this.props;

        if (error) {
            return <h1>{error.message}</h1>;
        }
        if (loading) {
            return <h1>loading</h1>;
        }

        const { chapter } = data;
        const { novel } = chapter;

        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Paper className={classes.content} elevation={4}>
                        {/* <Typography variant="h3" component="h3">
                            {novel.title}
                        </Typography> */}
                        <Typography className={classes.title} variant="h5" component="h3">
                            {chapter.title}
                        </Typography>
                        {chapter.paragraphs.map((item, index) => (
                            <Typography key={index} className={classes.contentItem} component="p">
                                {item}
                            </Typography>
                        ))}
                    </Paper>
                    <SpeedMenu
                        onClick={(item) => {
                            let i;
                            for (i = 0; i < novel.chapters.length; i++) {
                                if (novel.chapters[i]._id == chapter._id) {
                                    break;
                                }
                            }

                            if (item.name == 'Prev' && i != 0) {
                                this.props.router.push({
                                    pathname: '/chapter',
                                    query: {
                                        id: novel.chapters[i - 1]._id
                                    }
                                });
                                return;
                            }

                            if (item.name == 'Next' && i < novel.chapters.length - 1) {
                                this.props.router.push({
                                    pathname: '/chapter',
                                    query: {
                                        id: novel.chapters[i + 1]._id
                                    }
                                });
                                return;
                            }

                            if (item.name == 'Home') {
                                this.props.router.push({
                                    pathname: '/'
                                });
                            }

                            if (item.name == 'Mark') {
                                this.props.router.push({
                                    pathname: '/novel',
                                    query: {
                                        id: novel._id
                                    }
                                });
                            }
                        }}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const ChapterWithStyles = withStyles(styles, { withTheme: true })(Chapter);

const query = gql`
    query Chapter($id: String!) {
        chapter(id: $id) {
            _id
            title
            paragraphs
            novel {
                _id
                title
                chapters {
                    _id
                }
            }
        }
    }
`;

export default function WithQuery(props) {
    const { router } = props;
    return (
        <Query query={query} variables={{ id: router.query.id }}>
            {({ loading, error, data, refetch }) => (
                <ChapterWithStyles {...props} data={data} error={error} loading={loading} refetch={refetch} />
            )}
        </Query>
    );
}
