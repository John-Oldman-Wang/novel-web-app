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
                <div>
                    <Search />
                    <ul>
                        {this.state.novels.map(novel=>{
                            return (
                                <li
                                    style={{
                                        float:'left',
                                        width:'25%',
                                        padding:'0px 10px'
                                    }}
                                    key={novel._id}>
                                    <div
                                        style={{
                                            overflow: 'hidden',
                                            width:'250px',
                                            margin: '0px auto'
                                        }}
                                    >
                                        <Link  to={'/novel?v='+novel._id} rel={novel.title}>
                                            <h1
                                                style={{
                                                    overflow:'hidden',
                                                    textOverflow:'ellipsis',
                                                    whiteSpace:'nowrap',
                                                }}
                                            >{novel.title}</h1>
                                            <h3>{novel.category}</h3>
                                            <img src={novel.image} alt={novel.title}/>
                                            <p>{novel.lastUpdateTime}</p>
                                        </Link>
                                    </div>
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