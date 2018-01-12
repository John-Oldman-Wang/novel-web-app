const React = require('react');
const Component = React.Component
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
var xhr = new XMLHttpRequest()
class Search extends Component {
    constructor(props) {
        super(props)
        var obj
        if(!!this.props.location){
            obj =formSearch(decodeURI(this.props.location.search))
            console.log(obj)
            var xhr = new XMLHttpRequest()
            xhr.open('GET', '/search' + this.props.location.search+'&pbj=1', true)
            xhr.setRequestHeader('x-response-type', 'multipart')
            this.props.history.action == "POP" || window.p1.goto(50)
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText)
                    console.log(json)
                    this.setState({
                        novels: json
                    })
                    this.props.history.action == "POP" || window.p1.goto(100)
                } else {
                    this.props.history.action == "POP" || window.p1.goto(80)
                }
            }
            xhr.send()
        }
        this.state = {
            key: this.props.location?obj.key||'':'',
            novels:[]
        }
    }
    hanld(value){
        this.setState({
            key:value
        })
    }
    componentWillMount() {
        console.log("Search componentWillMount");
    }

    componentDidMount() {
        console.log("Search componentDidMount");
    }
    componentWillReceiveProps(nextProps) {
        console.log("Search componentWillReceiveProps");
        if (!!nextProps.location) {
            var obj = formSearch(decodeURI(nextProps.location.search))
            console.log('receive set state')
            this.setState({
                key: obj.key
            })
            console.log(this)
            xhr.abort()
            xhr.open('GET', '/search' + nextProps.location.search, true)
            xhr.setRequestHeader('x-response-type', 'multipart')
            nextProps.history.action == "POP" || window.p1.goto(50)
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText)
                    this.setState({
                        novels: json
                    })
                    nextProps.history.action == "POP" || window.p1.goto(100)
                } else {
                    nextProps.history.action == "POP" || window.p1.goto(80)
                }
            }
            xhr.send()
        }
    }
    shouldComponentUpdate() {
        console.log("Search shouldComponentUpdate");
        return true;
    }
    componentWillUpdate() {
        console.log("Search componentWillUpdate");
    }
    componentDidUpdate() {
        console.log("Search componentDidUpdate");
    }
    componentWillUnmount() {
        console.log("Search componentWillUnmount");
    }
    render() {
        return (
            <div className="search">
                <div className="search-form">
                    <input className="search-input" placeholder="可以搜索书名,可少字" type="text" value={this.state.key} onChange={(e) => {
                        this.hanld(e.target.value)
                    }} />
                    <button className="search-button"><Link to={"search?key=" + this.state.key}>搜&nbsp;索</Link></button>
                </div>
                <ul className="search-result">
                    {this.state.novels.map((novel, index) => {
                        return (
                            <li key={novel._id}>
                                <Link to={'/novel?v=' + novel._id} rel={novel.title}>
                                    <img className="search-novel-img" src={novel.image} alt={novel.title} />
                                    <div className="search-novel-mes-wrap">
                                        <h2 className="novel-title">{novel.title}</h2>
                                        <h3 className="novel-author">{novel.author}</h3>
                                        <p className="novel-intro">{novel.introduction}</p>
                                    </div>
                                </Link>
                            </li>
                        )
                    })}   
                </ul>
            </div>
        );
    }
}

module.exports = Search