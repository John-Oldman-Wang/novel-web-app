import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import IndexAppBar from '../comps/indexAppBar.jsx'
import ColumnCard from '../comps/columnCard.jsx'

const styles = {
    content: {
        padding: 8,
    }
}
class Index extends Component {
    constructor(props) {
        super(props)
        window.i = this
    }
    componentDidMount() {
        // this.props.getNovels()
    }
    render() {
        const { classes, items, loading, error, setNovel } = this.props
        var data = items
        var content = ''
        if (error) {
            content = <div>Error! {error.message}</div>;
        } else if (loading) {
            content = <div>Loading...</div>;
        } else {
            data.length == 0 && this.props.getNovels()
            content = <Grid className={classes.content} container spacing={16}>
                {data.map((item, index) => {
                    return (<Grid key={index} item lg={2} md={3} xs={4} >
                        <ColumnCard onClick={() => {
                            this.props.history.push(`/novel?v=${item._id}`)
                            setNovel(item)
                        }} title={item.title} author={item.author} image={item.image} />
                    </Grid>)
                })}
            </Grid>
        }
        return (
            <React.Fragment>
                <IndexAppBar />
                {content}
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Index)