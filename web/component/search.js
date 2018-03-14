import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import formSearch from '../plugin/formSearch.js'
import { cipher, decipher } from '../plugin/cryptoBro.js'
import request from '../plugin/request.js'
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel
} from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
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
        var { classes } =this.props
        classes = classes ||{}
        return (
            <div><div className={classes.contentContainer}>
                <form onSubmit={this.formGetResults||function(){}}>
                    <input
                        id="search"
                        name="search"
                        onChange={this.getSearchResults || function () { }}
                        type="search"
                        style={{ width: '100%', paddingLeft: '4px' }}
                        value={""}
                    />
                    <label htmlFor="search">Search</label>
                    <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                </form>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Filter Results</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.faculty}
                                    onChange={this.handleChange || function () { }('faculty') }
                                    value="faculty"
                                />
                            }
                            label="Faculty"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.department}
                                    onChange={this.handleChange || function () { }('department')}
                                    value="department"
                                />
                            }
                            label="Department"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.major}
                                    onChange={this.handleChange || function () { }('major')}
                                    value="major"
                                />
                            }
                            label="Major"
                        />
                    </FormGroup>
                </FormControl>
            </div>
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
            </div>
        );
    }
}

// module.exports = Search