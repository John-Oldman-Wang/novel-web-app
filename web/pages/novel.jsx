import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';


import CircularProgress from '@material-ui/core/CircularProgress'
import OtherAppBar from '../comps/otherAppBar.jsx'
import RowCard from '../comps/rowCard.jsx'
import DirectoryList from '../comps/DirectoryList.jsx'

const styles = theme => ({
    content: {
        padding: 8,
        // fontSize: `0`
    },
})

class Novel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
        window.n = this
    }
    render() {
        const { classes, item, loading, error, setNovel } = this.props
        var novel = item
        var content = ""
        var flag = "chapters" in novel && novel.chapters.length != 0
        var query = (function (search) {
            if (search == '') {
                return {}
            } else {
                var str = search.replace(/^\?/, '').replace(/=/g, '":"').replace(/\&/g, '","')
                str = '{"' + str + '"}'
                return JSON.parse(str)
            }
        })(this.props.location.search)
        if (item._id && item._id != query.v){//是否符合唯一资源定位
            setNovel({})
        }
        if (error) {
            content = <div>Error! {error.message}3 second back to home page</div>;
            this.timer=setTimeout(()=>{
                this.props.history.replace('/')
            },3000)
        } else if (loading) {
            if (Object.keys(novel) == 0) {
                content = <RowCard onClick={null} title={novel.title} author={novel.author} image={novel.image} category={novel.category} />
            } else if (!flag) {
                content = <RowCard onClick={() => {
                    this.props.history.push(`chapter/?c=${novel.chapters[0]._id}`)
                }} title={novel.title} author={novel.author} image={novel.image} category={novel.category} />
            } else {
                content = <RowCard onClick={() => {
                    this.props.history.push(`chapter/?c=${novel.chapters[0]._id}`)
                }} title={novel.title} author={novel.author} image={novel.image} category={novel.category} />
            }
        } else {
            console.log(novel)
            if (Object.keys(novel) == 0) {
                content = <RowCard onClick={null} title={novel.title} author={novel.author} image={novel.image} category={novel.category} />
            }else if (!flag) {
                content = <RowCard onClick={null} title={novel.title} author={novel.author} image={novel.image} category={novel.category} />
            }else {
                content = <RowCard onClick={() => {
                    this.props.history.push(`chapter/?c=${novel.chapters[0]._id}`)
                }} title={novel.title} author={novel.author} image={novel.image} category={novel.category} smallCategory={novel.smallCategory}/>
            }
            if (Object.keys(novel) == 0 || !flag) {
                console.log('need get novel')
                this.props.getNovel(query.v || "")
            }
        }
        return (
            <React.Fragment>
                <div>
                    <OtherAppBar title={novel.title} {...this.props} />
                </div>
                <div className={classes.content}>
                    {content}
                </div>
                <div className={classes.content}>
                    {flag?<DirectoryList onClick={(chapter) => {
                        console.log(chapter)
                        this.props.history.push(`chapter?c=${chapter.chapter_id}`)
                        //dispatch(chapter, novel)
                    }} list={novel.chapters} /> : <CircularProgress style={{display: 'block',margin: `0 auto`}}/>}
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Novel)