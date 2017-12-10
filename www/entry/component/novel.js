const React = require('react');
const Component = React.Component
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
const moment = require("moment")
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
        xhr.open('GET', '/novel' + this.props.location.search, true)
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
        console.log(novel)
        if(!!novel.title){
            return (
                <div>
                    <h2 style={{display:'inline-block'}}>{novel.title}</h2><span>{novel.shortintroduction}</span>
                    <img src={novel.image} alt={novel.title}/>
                    <h3>作者:&nbsp;&nbsp;{novel.author}</h3>
                    <p>{novel.introduction}</p>
                    <p>最后更新时间:&nbsp;&nbsp;{moment(novel.lastUpdateTime).format('YYYY年MM月DD日, h:mm:ss a')}</p>
                    <ul>
                        {novel.chapters.map((chapter,index)=>{
                            return(<li key={chapter._id} style={{float:"left",width:"25%",height:"200px"}}>
                                <Link to={{pathname:`/chapter`,hash:'',search:`?c=${chapter.chapter_id}`,state:novel}}>
                                    <h4>{chapter.title}</h4>
                                    <p>serialName:{chapter.serialName}</p>
                                    <p>serial:{chapter.serial}</p>
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