const React = require('react');
const Component = React.Component
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
var xhr = new XMLHttpRequest()
var timer;
class Chapter extends Component {
    constructor(props) {
        super(props)
        var obj = formSearch(this.props.location.search)
        var novel = this.props.location.state || {}
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
        xhr.open('GET', '/chapter' + this.props.location.search + "&pbj=1", true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        this.props.history.action == "POP" || window.p1.goto(50)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    chapter: Object.assign({}, this.state.chapter, json) || {}
                })
                this.props.history.action == "POP" || window.p1.goto(100)
                xhr.abort()
                xhr.open('GET', '/novel?v=' + this.state.chapter.novel_id + "&pbj=1", true)
                xhr.setRequestHeader('x-response-type', 'multipart')
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        var json = JSON.parse(xhr.responseText)
                        this.setState({
                            novel: Object.assign(this.state.novel, json) || {}
                        })
                    }
                }
                xhr.send()
            } else {
                this.props.history.action == "POP" || window.p1.goto(80)
            }
        }
        xhr.send()
    }
    handle(e) {
        if (this.refs.header.style.display == "none") {
            // clearTimeout(timer)
            this.refs.header.style.display = "flex";
            this.refs.content.style.paddingTop = "40px";
            this.refs.menu.style.display = "flex";
            // timer = setTimeout(() => {
            //     if(this.refs.header) this.refs.header.style.display="none";
            //     if (this.refs.menu) this.refs.menu.style.display="none";
            //     this.refs.content.style.paddingTop = "0px";
            // }, 3000)
            //alert(this.refs.header.style.display)
        } else {
            // clearTimeout(timer)
            this.refs.content.style.paddingTop = "0px";
            this.refs.header.style.display = "none";
            this.refs.menu.style.display = "none";
        }

    }
    componentWillMount() {
        console.log("chapter componentWillMount");
    }

    componentDidMount() {
        console.log("chapter componentDidMount");
    }

    componentWillReceiveProps(nextProps) {
        var obj = formSearch(nextProps.location.search)
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
        this.props.history.action == "POP" || window.p1.goto(50)
        xhr.abort()
        xhr.open('GET', '/chapter' + nextProps.location.search + "&pbj=1", true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    chapter: Object.assign(this.state.chapter, json) || {}
                })
                this.props.history.action == "POP" || window.p1.goto(100)
            } else {
                this.props.history.action == "POP" || window.p1.goto(80)
            }
        }
        xhr.send()
        console.log("chapter componentWillReceiveProps");
    }

    shouldComponentUpdate() {
        console.log("chapter shouldComponentUpdate");
        return true;
    }

    componentWillUpdate() {
        console.log("chapter componentWillUpdate");
    }

    componentDidUpdate() {
        console.log("chapter componentDidUpdate");
    }

    componentWillUnmount() {
        console.log("chapter componentWillUnmount");
    }

    render() {
        window.t=this
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
module.exports = Chapter