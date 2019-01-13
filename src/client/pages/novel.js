import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import OtherAppBar from '../components/otherAppBar';
import RowCard from '../components/rowCard';
import DirectoryList from '../components/directoryList';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const styles = () => ({
    content: {
        padding: 8
    }
});

class Novel extends Component {
    render() {
        const { classes, data, loading, error } = this.props;
        if (error) {
            return <div>Error! {error.message}</div>;
        }
        if (loading) {
            return <CircularProgress style={{ display: 'block', margin: `0 auto` }} />;
        }
        const novel = data.novel;
        return (
            <React.Fragment>
                <div>
                    <OtherAppBar title={novel.title} {...this.props} />
                </div>
                <div className={classes.content}>
                    <RowCard
                        title={novel.title}
                        author={novel.author}
                        image={novel.image}
                        category={novel.category}
                        smallCategory={novel.smallCategory}
                        onClick={() => {
                            this.props.router.push({
                                pathname: '/chapter',
                                query: {
                                    id: novel.chapters[0]._id
                                }
                            });
                        }}
                    />
                </div>
                <div className={classes.content}>
                    <DirectoryList
                        onClick={(item) => {
                            this.props.router.push({
                                pathname: '/chapter',
                                query: {
                                    id: item._id
                                }
                            });
                        }}
                        list={novel.chapters}
                    />
                </div>
            </React.Fragment>
        );
    }
}

const NovelWithStyles = withStyles(styles)(Novel);

const query = gql`
    query Novel($id: String!) {
        novel(id: $id) {
            title
            author
            image
            category
            smallCategory
            chapters {
                _id
                title
            }
        }
    }
`;

export default function WithQuery(props) {
    const { router } = props;
    return (
        <Query query={query} variables={{ id: router.query.id }}>
            {({ loading, error, data, refetch }) => (
                <NovelWithStyles {...props} data={data} error={error} loading={loading} refetch={refetch} />
            )}
        </Query>
    );
}
