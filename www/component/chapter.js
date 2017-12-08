const React = require('react');
const { Component } = require('react')
const { Link } = require('react-router-dom')
const formSearch = require('../plugin/formSearch.js')
const moment = require("moment")
class Chapter extends Component {
    constructor(props) {
        super(props)
        var query = (formSearch(this.props.location.search))
        this.state = {
            chapter: {
                _id: formSearch(this.props.location.search)
            }
        }
        var xhr = new XMLHttpRequest()
        var xhr = new XMLHttpRequest()
        xhr.open('GET', '/chapter' + this.props.location.search, true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        this.props.history.action == "POP" || window.p1.goto(50)
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    chapter: json||{}
                })
                this.props.history.action == "POP" || window.p1.goto(100)
            } else {
                this.props.history.action == "POP" || window.p1.goto(80)
            }
        }
        xhr.send()
    }
    componentWillMount() {
        console.log("chapter componentWillMount");
    }

    componentDidMount() {
        console.log("chapter componentDidMount");
    }

    componentWillReceiveProps(nextProps) {
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
        console.log('chapter render')
        console.log(this)
        var chapter = this.state.chapter
        if (!!chapter['title']) {
            return (
                <div>
                    <Link to={'/novel?v=' + chapter.novel_id}>&nbsp;&lt;&nbsp;</Link>
                    <h3 style={{ display: 'inline-block' }}>&nbsp;&nbsp;&nbsp;&nbsp;{chapter.title}</h3>
                    <Link to={'/chapter'}>&nbsp;&lt;&nbsp;</Link>
                    <div style={{
                        padding:"0px 15px"
                    }}>
                        {chapter.paragraphs.map((paragraph,index) => {
                            return (<p style={{
                                textIndent:"30px",
                                lineHeight:"150%"
                            }} key={index}>{paragraph}</p>)
                        })}
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    加载中....
                </div>
            );
        }
    }
}
module.exports = Chapter