const React = require('react');
const { Component } = require('react')
const formSearch = require('../plugin/formSearch.js')
const moment = require()
class Novel extends Component {
    constructor(props) {
        super(props)
        console.log(this)
        var query=(formSearch(this.props.location.search))
        this.state = {
            novel:{
                _id: formSearch(this.props.location.search)
            }
        }
        var xhr = new XMLHttpRequest()
        var xhr = new XMLHttpRequest()
        xhr.open('GET', '/novel' + this.props.location.search, true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        this.props.history.action=="POP"||window.p1.goto(50)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    novel: json.novel
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
                <div>
                    <h2 style={{display:'inline-block'}}>{novel.title}</h2><span>{novel.shortintroduction}</span>
                    <img src={novel.image} alt={novel.title}/>
                    <h3>作者:&nbsp;&nbsp;{novel.author}</h3>
                    <p>{novel.introduction}</p>
                    <p>最后更新时间:&nbsp;&nbsp;{novel.lastUpdateTime}</p>
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