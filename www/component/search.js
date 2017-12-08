const React = require('react');
const { Component } = require('react')
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
const url=require('url-parse')
class Search extends Component {
    constructor(props) {
        super(props)
        console.log('Search constructor')
        if(!!this.props.location){
            var location = this.props.location
            var u = new url(location.pathname + location.search)
            console.log(u)
            var query = (formSearch(this.props.location ? this.props.location.search : ''))
        }
        this.state = {
            key: this.props.location?query.key:''
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
            <div>
                <input type="text" value={this.state.key} onChange={(e)=>{
                    this.hanld(e.target.value)
                }}/><Link to={"search?key="+this.state.key}>搜&nbsp;索</Link>
            </div>
        );
    }
}

module.exports = Search