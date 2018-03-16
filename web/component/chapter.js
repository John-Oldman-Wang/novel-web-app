import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import formSearch from '../plugin/formSearch.js'

import { cipher, decipher } from '../plugin/cryptoBro.js'
import request from '../plugin/request.js'
var xhr = new request()
var timer;
export class Chapter extends Component {
    constructor(props) {
        super(props)
        if (this.props.location.search){
            var obj = formSearch(this.props.location.search)
            if(obj.c==''){
                this.props.history.push('/')
                this.state = {}
                return
            }
            var novel = this.props.location.state || {}
        }else{
            this.props.history.push('/')
            this.state = {}
            return
        }
        var chapter
        if ("chapters" in novel) {
            for (var i = 0; i < novel.chapters.length; i++) {
                if (novel.chapters[i].chapter_id == obj.c) {
                    chapter = novel.chapters[i]
                    break;
                }
            }
        } else {
            chapter = {
                _id: obj.c
            }
        }
        this.state = {
            novel: novel,
            chapter: chapter,
            fontSize: 22
        }
        if ('paragraphs' in this.state.chapter){
            return
        }
        xhr.get('/chapter' + this.props.location.search + "&pbj=1",(e)=>{
            var json = JSON.parse(decipher(e.responseText))
            if (json == null) {
                this.props.history.push('/')
                return
            }
            this.setState({
                chapter: Object.assign({}, this.state.chapter, json) || {}
            })
            xhr.get('/novel?v=' + this.state.chapter.novel_id + "&pbj=1",(e)=>{
                var json = JSON.parse(decipher(e.responseText))
                this.setState({
                    novel: Object.assign(this.state.novel, json) || {}
                })
            }).send()
        }).send()
    }
    handle(e) {
        if (this.refs.header.style.display == "none") {
            // clearTimeout(timer)
            this.refs.header.style.display = "flex";
            this.refs.content.style.paddingTop = "40px";
            this.refs.menu.style.display = "flex";
        } else {
            // clearTimeout(timer)
            this.refs.content.style.paddingTop = "0px";
            this.refs.header.style.display = "none";
            this.refs.menu.style.display = "none";
        }

    }
    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        var obj = formSearch(nextProps.location.search)
        if (obj.c == '') {
            this.state = {}
            return
        }
        var novel = this.state.novel
        var chapter
        for (var i = 0; i < novel.chapters.length; i++) {
            if (novel.chapters[i].chapter_id == obj.c) {
                chapter = novel.chapters[i]
                break;
            }
        }
        this.setState({
            chapter: chapter
        })
        if ('paragraphs' in chapter && chapter.paragraphs.length>0) {
            return
        }
        xhr.abort()
        xhr.open('GET', '/chapter' + nextProps.location.search + "&pbj=1", true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(decipher(xhr.responseText))
                this.setState({
                    chapter: Object.assign(this.state.chapter, json) || {}
                })
            }
        }
        xhr.send()
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    render() {
        if(!("chapter" in this.state)){
            return (<p></p>)
        }
        
        var chapter = this.state.chapter
        chapter.paragraphs = chapter.paragraphs || []
        var chapters = this.state.novel.chapters || []
        var provChapter
        var nextChapter
        if (chapters.length != 0) {
            for (var i = 0; i < chapters.length; i++) {
                if (chapter._id == chapters[i].chapter_id) {
                    chapter = Object.assign(chapters[i], chapter)
                    break;
                }
            }
            provChapter = chapters[(chapters.indexOf(chapter) + chapters.length - 1) % chapters.length] || {}
            nextChapter = chapters[(chapters.indexOf(chapter) + 1) % chapters.length] || {}
        } else {
            provChapter = {}
            nextChapter = {}
        }
        return (
            <div className="chapter-page">
                <div className="chapter-header yellow-bgc" ref="header" style={{ display: "none" }}>
                    <Link className="chapter-title" to={{
                        pathname: '/novel',
                        search: `?v=${this.state.novel._id}`,
                        state: this.state.novel
                    }}><svg xmlns="http://www.w3.org/2000/svg" style={{ margin: "5px 5px 0px 5px" }} width="20px" height="35px" version="1.1">
                            <polyline points="20,0 0,15 20,30" style={{ fill: "transparent", stroke: "#aaa", strokeWidth: 2 }} /></svg></Link>
                    <Link className="chapter-title" to={{
                        pathname: '/novel',
                        search: `?v=${this.state.novel._id}`,
                        state: this.state.novel
                    }}>{this.state.novel.title}</Link>
                </div>
                <div style={{ fontSize: "14px" }} className="chapter-content yellow-bgc" ref="content" style={{paddingTop: "0px"}} onClick={(e) => {
                    this.handle(e)
                }}>
                    <h2 className="chapter-title ">{chapter.title}</h2>
                    <div className="chapter-paragraphs" ref="paragraphs">
                        {!chapter.paragraphs.length ? (<p className="chapter-paragraph">加载中...</p>) : chapter.paragraphs.map((paragraph, index) => {
                            return (<p className="chapter-paragraph" key={index}>{paragraph}</p>)
                        })}
                    </div>
                </div>
                <div className="chapter-menu yellow-bgc" ref="menu" style={{ display: "none" }}>
                    <Link className="chapter-pre" to={{
                        pathname: '/chapter',
                        search: `?c=${provChapter.chapter_id || ''}`,
                        state: this.state.novel
                    }}>上一章</Link>
                    <span className="chapter-progress">
                        {`${chapters.indexOf(chapter) + 1}/${chapters.length}`}
                    </span>
                    <Link className="chapter-next" to={{
                        pathname: '/chapter',
                        search: `?c=${nextChapter.chapter_id || ''}`,
                        state: this.state.novel
                    }}>下一章</Link>
                </div>
            </div>
        );
    }
}
// module.exports = Chapter