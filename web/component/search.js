import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import formSearch from '../plugin/formSearch.js'
import { cipher, decipher } from '../plugin/cryptoBro.js'
import request from '../plugin/request.js'
var xhr = new request()
export class Search extends Component {
    constructor(props) {
        super(props)
        var obj
        if(!!this.props.location){
            obj =formSearch(decodeURI(this.props.location.search))
            xhr.get( '/search' + this.props.location.search+'&pbj=1', (e) => {
                var json = JSON.parse(decipher(e.responseText))
                this.setState({
                    novels: json
                })
                this.props.history.action == "POP" || window.p1.goto(100)
            })
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
            this.setState({
                key: obj.key
            })
            xhr.abort()
            xhr.get('/search' + nextProps.location.search, (e) => {
                var json = JSON.parse(decipher(e.responseText))
                this.setState({
                    novels: json
                })
                
            })
            xhr.send()
        }
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

// module.exports = Search