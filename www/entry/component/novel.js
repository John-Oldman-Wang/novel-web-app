const React = require('react');
const Component = React.Component
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
const formDate = require('../plugin/formDate.js')
var xhr = new XMLHttpRequest()
class Novel extends Component {
    constructor(props) {
        super(props)
        var query=formSearch(this.props.location.search)
        this.state = {
            novel:{
                _id: formSearch(this.props.location.search).v
            }
        }
        var xhr = new XMLHttpRequest()
        xhr.open('GET', '/novel' + this.props.location.search +"&pbj=1", true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        this.props.history.action=="POP"||window.p1.goto(50)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    novel: Object.assign(this.state.novel,json||{})
                })
                this.props.history.action == "POP" ||window.p1.goto(100)
            }else{
                this.props.history.action == "POP" ||window.p1.goto(80)
            }
        }
        xhr.send()
    }
    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        var novel=this.state.novel
        if(!!novel.title){
            return (
                <div >
                    <div className="novel-header">    
                        <img className="search-novel-img" src={novel.image} alt={novel.title} />
                        <div className="search-novel-mes-wrap">
                            <h2 className="novel-title">{novel.title}</h2>
                            <h3 className="novel-author">作者:&nbsp;&nbsp;{novel.author}</h3>
                            {/* <h3>{novel.category}</h3> */}
                            <p className="novel-intro">简介:{novel.introduction}</p>
                            <p >最后更新时间:&nbsp;&nbsp;{formDate(novel.lastUpdateTime)}</p>
                        </div>
                    </div>
                    <p style={{
                        paddingTop: "10px",
                        paddingBottom: "5px",
                        textAlign:"center",
                        fontSize:"1.3em",
                        fontWeight:"blod",
                        borderBottom:"1px solid red"
                    }}>目&nbsp;&nbsp;录</p>
                    <ul>
                        {novel.chapters.map((chapter,index)=>{
                            return(<li key={chapter._id} style={{width:"100%",lineHeight:"1.5",padding:"5px 0px",borderBottom:"1px solid RGBA(153,153,153,0.6)"}}>
                                <Link to={{pathname:`/chapter`,hash:'',search:`?c=${chapter.chapter_id}`,state:novel}}>
                                    <h4 style={{paddingLeft:"5px"}}>{(chapter.serialName||chapter.serial)+"  "+chapter.title}</h4>
                                </Link>
                            </li>)
                        })}
                    </ul>
                </div>
            );
        }else{
            return (
                <div>
                    加载中....
                </div>
            );
        }
    }
}
module.exports = Novel