import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import IndexAppBar from '../components/indexAppBar';
import ColumnCard from '../components/columnCard';
import Link from 'next/link';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const styles = (theme) => {
    return {
        content: {
            padding: theme.spacing.unit
        },
        link: {
            textDecoration: 'none'
        }
    };
};

class Index extends React.Component {
    render() {
        const { classes, data, loading, error, refetch } = this.props;
        let content = '';
        if (error) {
            content = <div>Error! {error.message}</div>;
        } else if (loading) {
            content = (
                <div style={{ flex: '1' }}>
                    <CircularProgress style={{ display: 'block', margin: `0 auto` }} />
                </div>
            );
        } else {
            content = (
                <Grid className={classes.content} container spacing={16}>
                    {data.randomNovels.map((item, index) => {
                        return (
                            <Grid key={index} item lg={2} md={3} xs={4}>
                                <Link href={{ pathname: '/novel', query: { id: item._id } }}>
                                    <a className={classes.link}>
                                        <ColumnCard
                                            // onClick={() => {
                                            //     this.props.history.push(`/novel?v=${item._id}`);
                                            //     setNovel(item);
                                            // }}
                                            title={item.title}
                                            author={item.author}
                                            image={item.image}
                                        />
                                    </a>
                                </Link>
                            </Grid>
                        );
                    })}
                </Grid>
            );
        }
        return (
            <React.Fragment>
                <IndexAppBar history={this.props.history} />
                {/* <button
                    onClick={() => {
                        refetch();
                    }}>
                    refetch
                </button> */}
                {content}
            </React.Fragment>
        );
    }
}

const Com = withStyles(styles)(Index);
const query = gql`
    query {
        randomNovels(amount: 12) {
            _id
            title
            image
            author
        }
    }
`;

export default function WithQuery(props) {
    return (
        <Query query={query}>
            {({ loading, error, data, refetch }) => <Com {...props} data={data} error={error} loading={loading} refetch={refetch} />}
        </Query>
    );
}
