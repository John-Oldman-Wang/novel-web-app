import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class SearchHead extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key: '',
        }
    }
    hanld(value) {
        this.setState({
            key: value
        })
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
            </div>
        );
    }
}

module.exports = SearchHead