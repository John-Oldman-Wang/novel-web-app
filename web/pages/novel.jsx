import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles';

import OtherAppBar from '../comps/otherAppBar.jsx'
import RowCard from '../comps/rowCard.jsx'
import DirectoryList from '../comps/DirectoryList.jsx'

const styles = theme=>({
    content: {
        padding: 8,
        fontSize: `0`
    },
})

class Novel extends Component {
    constructor(props) {
        super(props)
        this.state={
            open: false
        }
        window.n=this
    }
    render() {
        const { classes, novel, dispatch } = this.props
        return (
            <React.Fragment>
                <div>
                    <OtherAppBar title={novel.title} {...this.props}/>
                </div>
                <div className={classes.content}>
                    <RowCard onClick={()=>{
                        this.props.history.push(`chapter/?c=${novel.chapters[0]._id}`)
                    }} title={novel.title} author={novel.author} image={novel.image} category={novel.category}/>
                </div>
                <div className={classes.content}>
                    <DirectoryList onClick={(chapter)=>{
                        console.log(chapter)
                        this.props.history.push(`chapter?c=${chapter.chapter_id}`)
                        dispatch(chapter,novel)
                    }} list={novel.chapters}/>
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Novel)