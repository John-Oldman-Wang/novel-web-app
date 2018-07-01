import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import SpeedMenu from '../comps/SpeedMenu.jsx'

const styles = (theme)=>({
    root: {
        padding: 8,
        backgroundImage: `linear-gradient`
    },
    content: {
        padding: `10px 0px`,
        fontFamily: "Microsoft YaHei"
        // overflow: `scroll`
    },
    textIndent: {
        textIndent: `2em`,
        padding: `0px 8px`,
        boxShadow: `none`
    },
    button: {
        fontSize: `20px`,
        fontWeight: 900,
        width: `auto`
    }
})

class Chapter extends Component {
    constructor(props) {
        super(props)
        window.c = this
    }
    render() {
        const { classes, index, novel, chapter, getChapter, getNovel } = this.props
        var query = (function (search) {
            if (search == '') {
                return {}
            } else {
                var str = search.replace(/^\?/, '').replace(/=/g, '":"').replace(/\&/g, '","')
                str = '{"' + str + '"}'
                return JSON.parse(str)
            }
        })(this.props.location.search)
        if(chapter.error){
            return <h1>{chapter.error.message}</h1>
        }
        if(chapter.loading){
            return <h1>loading</h1>
        }
        if(Object.keys(chapter.item)==0){
            Promise.resolve().then(()=>{
                getChapter(query.c||'')
            })
            return <h1>loading</h1>
        }
        if(chapter.item._id !== query.c){
            Promise.resolve().then(() => {
                getChapter(query.c||'')
            })
            return <h1>loading</h1>
        }
        if(!novel.error&&!novel.loading&&Object.keys(novel.item)==0){
            Promise.resolve().then(()=>{
                getNovel(chapter.item.novel_id)
            })
            return null;
        }
        console.log('chapter all render')
        const chapterItem = chapter.item
        const novelItem = novel.item
        let serial;
        let chapters = (novelItem.chapters||[])
        for(let i=0; i<chapters.length; i++){
            if (chapters[i].chapter_id == chapterItem._id){
                serial=i;
                break;
            }
        }

        return (
            <React.Fragment>
                <div className={classes.root}>
                    <Paper className={classes.content} elevation={4}>
                        <div style={{
                            display: `flex`,
                            justifyContent: ``
                        }}>
                            <Button className={classes.button}>{novelItem.title?`《${novelItem.title}》`: ""}</Button>
                            <Typography style={{
                                lineHeight: `44px`,
                                fontWeight: 900,
                                boxShadow: `none`
                            }} component="h5">
                                {chapterItem.title || ""}
                            </Typography>
                        </div>
                        {(chapterItem.paragraphs || []).map((item, index) => {
                            return (<Typography key={index} className={classes.textIndent} component="p">
                                {item}
                            </Typography>)
                        })}
                    </Paper>
                    <SpeedMenu onClick={(item) => {
                        if(item.name == 'Prev'){
                            serial != 0 && this.props.history.push(`/chapter?c=${novelItem.chapters[serial - 1].chapter_id}`)
                            return 
                        }
                        if (item.name == 'Next'){
                            serial != novelItem.chapters.length && this.props.history.push(`/chapter?c=${novelItem.chapters[serial + 1].chapter_id}`)
                            return
                        }
                        if (item.name == 'Home'){
                            this.props.history.push(`/`)
                            return
                        }
                    }} />
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles, { withTheme: true })(Chapter)