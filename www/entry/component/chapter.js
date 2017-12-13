const React = require('react');
const Component = React.Component
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
const moment = require("moment")
var xhr = new XMLHttpRequest()
class Chapter extends Component {
    constructor(props) {
        super(props)
        var obj=formSearch(this.props.location.search)
        var novel=this.props.location.state||{}
        var chapter
        if("chapters" in novel){
            for(var i=0;i<novel.chapters.length;i++){
                if(novel.chapters[i].chapter_id==obj.c){
                    chapter=novel.chapters[i]
                    break;
                }
            }
        }else{
            chapter={
                _id:obj.c
            }
        }
        this.state = {
            novel: novel,
            chapter: chapter,
            fontSize:22
        }
        console.log(this)
        xhr.open('GET', '/chapter' + this.props.location.search, true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        this.props.history.action == "POP" || window.p1.goto(50)
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    chapter: Object.assign({},this.state.chapter,json)||{}
                })
                this.props.history.action == "POP" || window.p1.goto(100)
                xhr.abort()
                xhr.open('GET', '/novel?v=' + this.state.chapter.novel_id, true)
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
            }else{
                this.props.history.action == "POP" || window.p1.goto(80)
            }
        }
        xhr.send()
    }

    handle(e){
        this.setState({fontSize:e.target.value})
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
        this.props.history.action == "POP" || window.p1.goto(50)
        xhr.abort()
        xhr.open('GET', '/chapter' + nextProps.location.search, true)
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
        var chapter = this.state.chapter
        chapter.paragraphs = chapter.paragraphs||[]
        var chapters = this.state.novel.chapters||[]
        var provChapter
        var nextChapter
        if(chapters.length!=0){
            for(var i=0;i<chapters.length;i++){
                if(chapter._id==chapters[i].chapter_id){
                    chapter=Object.assign(chapters[i],chapter)
                    break;
                }
            }
            provChapter=chapters[(chapters.indexOf(chapter)+chapters.length-1)%chapters.length]||{}
            nextChapter=chapters[(chapters.indexOf(chapter)+1)%chapters.length]||{}
        }else{
            provChapter={}
            nextChapter={}
        }
        window.t=this
        return (
            <div>
                <div style={{padding: "5px 10px 0px"}}>
                    <button><Link to={'/novel?v=' + this.state.novel._id}>
                        &nbsp;返回&nbsp;
                    </Link></button>
                    <button><Link to={{
                            pathname: '/chapter',
                            search: `?c=${provChapter.chapter_id || ''}`,
                            state: this.state.novel
                        }}>&nbsp;上一章;&nbsp;
                    </Link></button>
                    <button><Link to={{
                            pathname: '/chapter',
                            search: `?c=${nextChapter.chapter_id || ''}`,
                            state: this.state.novel
                        }}>&nbsp;下一章;&nbsp;
                    </Link></button>
                    <input style={{
                        verticalAlign: "bottom",
                        margin: "0px 5px",
                        padding: "1px 0px"
                    }} type="range" value={this.state.fontSize} max="44" min="10" step="1" onInput={(e)=>{this.handle(e)} }/>
                </div>
                <div style={{padding:"5px 10px 0px"}}>
                    <h3 style={{ display: 'inline-block' }}>{chapter.serialName || chapter.serial}&nbsp;&nbsp;&nbsp;&nbsp;{chapter.title}</h3>
                    {!chapter.paragraphs.length?'加载中...':chapter.paragraphs.map((paragraph,index) => {
                        return (<p style={{
                            fontSize: this.state.fontSize+'px',
                            textIndent:"2em",
                            lineHeight:"120%",
                            margin:'5px'
                        }} key={index}>{paragraph}</p>)
                    })}
                </div>
                {!chapter.paragraphs.length?'':<div style={{padding: "5px 10px 0px"}}>
                    <button><Link to={'/novel?v=' + this.state.novel._id}>
                        &nbsp;返回&nbsp;
                    </Link></button>
                    <button><Link to={{
                        pathname: '/chapter',
                        search: `?c=${provChapter.chapter_id || ''}`,
                        state: this.state.novel
                    }}>&nbsp;上一章;&nbsp;</Link></button>
                    <button><Link to={{
                            pathname: '/chapter',
                            search: `?c=${nextChapter.chapter_id || ''}`,
                            state: this.state.novel
                        }}>&nbsp;下一章;&nbsp;
                    </Link></button>
                    <input style={{
                        verticalAlign: "bottom",
                        margin: "0px 5px",
                        padding: "1px 0px"
                    }} type="range" value={this.state.fontSize} max="44" min="10" step="1" onInput={(e)=>{this.handle(e)}}/>
                </div>}
            </div>
        );
    }
}
module.exports = Chapter