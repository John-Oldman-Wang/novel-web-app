const React = require('react');
const Component = React.Component
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
const moment = require("moment")
var xhr = new XMLHttpRequest()
class Chapter extends Component {
    constructor(props) {
        super(props)
        console.log(this)
        var obj=formSearch(this.props.location.search)
        var novel=this.props.location.state
        var chapter
        for(var i=0;i<novel.chapters.length;i++){
            if(novel.chapters[i].chapter_id==obj.c){
                chapter=novel.chapters[i]
                break;
            }
        }
        this.state = {
            novel: novel,
            chapter: chapter
        }
        xhr.open('GET', '/chapter' + this.props.location.search, true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        this.props.history.action == "POP" || window.p1.goto(50)
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    chapter: Object.assign(this.state.chapter,json)||{}
                })
                this.props.history.action == "POP" || window.p1.goto(100)
            }else{
                this.props.history.action == "POP" || window.p1.goto(80)
            }
        }
        xhr.send()
    }
    componentWillMount() {
        console.log("chapter componentWillMount");
    }

    componentDidMount() {
        console.log("chapter componentDidMount");
    }

    componentWillReceiveProps(nextProps) {
        //this.setState
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
        xhr.abort()
        xhr.open('GET', '/chapter' + nextProps.location.search, true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        this.props.history.action == "POP" || window.p1.goto(50)
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
        var chapter = this.state.chapter
        chapter.paragraphs = chapter.paragraphs||[]
        var chapters = this.state.novel.chapters
        console.log(chapters[0])
        var provChapter=chapters[(chapters.indexOf(chapter)+chapters.length-1)%chapters.length]
        var nextChapter=chapters[(chapters.indexOf(chapter)+1)%chapters.length]
        if (!!chapter['title']) {
            return (
                <div>
                    <div>
                        <Link to={'/novel?v=' + this.state.novel._id}>
                            <button>&nbsp;返回&nbsp;</button>
                        </Link>
                        <Link to={{
                            pathname: '/chapter',
                            search: `?c=${provChapter.chapter_id}`,
                            state: this.state.novel
                        }}>
                            <button>&nbsp;上一章;&nbsp;</button>
                        </Link>
                        <Link to={{
                            pathname:'/chapter',
                            search: `?c=${nextChapter.chapter_id}`,
                            state:this.state.novel
                        }}>
                            <button>&nbsp;下一章;&nbsp;</button>
                        </Link>
                    </div>
                    <div><h3 style={{ display: 'inline-block' }}>{chapter.serialName || chapter.serial}&nbsp;&nbsp;&nbsp;&nbsp;{chapter.title}</h3></div>
                    <div style={{
                        padding:"0px 10px"
                    }}>
                        {!chapter.paragraphs.length?'加载中...':chapter.paragraphs.map((paragraph,index) => {
                            return (<p style={{
                                fontSize:'22px',
                                textIndent:"2em",
                                lineHeight:"150%",
                                margin:'10px'
                            }} key={index}>{paragraph}</p>)
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    加载中....
                </div>
            );
        }
    }
}
module.exports = Chapter