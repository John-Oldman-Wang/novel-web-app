const React = require('react');
const { Component } = require('react')
const { Link } =require('react-router-dom')
const Search = require('./search.js')
class Index extends Component {
    constructor(props){
        super(props)
        console.log(this)
        this.state={
           novels:[] 
        }
        window.p1.goto(50)
        var xhr = new XMLHttpRequest()
        xhr.open('GET', '/index', true)
        xhr.setRequestHeader('x-response-type', 'multipart')
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText)
                this.setState({
                    novels: json.novels
                })
                window.p1.goto(100)
            }else{
                window.p1.goto(80)
            }
        }
        xhr.send()
    }
    componentWillMount(){
    }
    render() {
        if(this.state.novels.length==0){
            return (
                <div>
                    <Search/>
                    加载中
                </div>
            );
        }else{
            return(
                <div>
                    <Search />
                    <ul>
                        {this.state.novels.map(novel=>{
                            return (
                                <li key={novel._id}>
                                    <Link  to={'/novel?v='+novel._id}>  
                                    <h1>{novel.title}</h1>
                                    <img src={novel.image} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )
        }
    }
    componentDidMount(){
    }
}
module.exports = Index