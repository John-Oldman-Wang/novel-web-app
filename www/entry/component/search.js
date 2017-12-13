const React = require('react');
const Component = React.Component
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
var xhr = new XMLHttpRequest()
class Search extends Component {
    constructor(props) {
        super(props)
        console.log(this)
        var obj
        if(!!this.props.location){
            obj =formSearch(decodeURI(this.props.location.search))
            console.log(obj)
            var xhr = new XMLHttpRequest()
            xhr.open('GET', '/search' + this.props.location.search, true)
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
        console.log(this)
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
        if(!!this.props.location){
            return (
                <div style={{padding:"10px 5px 0px 5px"}}>
                    <div>
                        <input type="text" value={this.state.key} onChange={(e) => {
                            this.hanld(e.target.value)
                        }} /><button style={{
                            border:"1px solid black",
                            verticalAlign:"bottom"
                            }}><Link to={"search?key=" + this.state.key}>搜&nbsp;索</Link>
                        </button>
                    </div>
                    <ul style={{width:"100%",paddingTop:"5px"}}>
                        {this.state.novels.map((novel, index) => {
                            return (
                                <Link to={'/novel?v=' + novel._id} rel={novel.title}>
                                    <li style={{
                                        width: "100%",
                                        marginBottom: "5px",

                                    }} key={novel._id}>
                                        <div style={{ height: "100%", width: "33%", display: "inline-block" }}>
                                            <img style={{ width: '100%' }} src={novel.image} alt={novel.title} />
                                        </div>
                                        <div style={{
                                            height: "100%",
                                            width: "66%",
                                            display: "inline-block",
                                            verticalAlign: "top"
                                        }}>
                                            <h1
                                                style={{
                                                    fontSize: "1.2em",
                                                    fontWeight: "bold",
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >&nbsp;{novel.title}</h1>
                                            <h3>{novel.category}</h3>
                                            <p>简介:{novel.shortintroduction}</p>
                                        </div>
                                    </li>
                                </Link>)
                        })}   
                    </ul>
                </div>
            );
        }else{
            return (<div>
                    <input type="text" value={this.state.key} onChange={(e) => {
                        this.hanld(e.target.value)
                    }} />
                    <button style={{ border: "1px solid black", verticalAlign: "bottom"}}>
                        <Link to={"search?key=" + this.state.key}>搜&nbsp;索</Link>
                    </button>
                </div>);
        } 
    }
}

module.exports = Search