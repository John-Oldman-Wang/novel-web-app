const React = require('react');
const Component = React.Component
const { Link } =require('react-router-dom')
const Search = require('./search.js')
var xhr = new XMLHttpRequest()
class Index extends Component {
    constructor(props){
        super(props)
        console.log(this)
        this.state={
           novels:[] 
        }
        window.p1.goto(50)
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
                <div style={{padding:"10px 5px 0px 5px"}}>
                    <Search />
                    <ul style={{width:"100%",paddingTop:"5px"}}>
                        {this.state.novels.map(novel=>{
                            return (
                                <Link to={'/novel?v=' + novel._id} rel={novel.title}>
                                    <li style={{
                                            width:"100%",
                                            marginBottom:"5px",
                                            
                                        }} key={novel._id}>
                                        <div style={{height:"100%",width:"33%",display:"inline-block"}}>
                                            <img style={{width:'100%'}} src={novel.image} alt={novel.title}/>
                                        </div>
                                        <div style={{
                                            height:"100%",
                                            width:"66%",
                                            display:"inline-block",
                                            verticalAlign: "top"
                                        }}>
                                            <h1
                                                style={{
                                                    fontSize:"1.2em",
                                                    fontWeight:"bold",
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >&nbsp;{novel.title}</h1>
                                            <h3>{novel.category}</h3>
                                            <p>简介:{novel.shortintroduction}</p>
                                        </div>
                                    </li>
                                </Link>
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