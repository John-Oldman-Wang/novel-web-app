import React, { Component } from 'react'
import { Link } from 'react-router-dom'
var xhr = new XMLHttpRequest()
import Search from './searchHeader.js'
export class Index extends Component {
    constructor(props){
        super(props)
        this.state={
           novels:[] 
        }
        window.p1.goto(50)
        xhr.open('GET', '/index?pbj=1', true)
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
                    加载中
                </div>
            );
        }else{
            return(
                <div>
                    <Search />
                    <ul className="novel-list">
                        {this.state.novels.map(novel=>{
                            return (
                                <li key={novel._id}>
                                    <Link to={'/novel?v=' + novel._id} rel={novel.title}>
                                        <div className="novel-img">
                                            <div className="imgbox"></div>
                                            <div className="img">
                                            <img  src={novel.image} alt={novel.title}/>
                                            </div>
                                        </div>
                                        <div className="novel-message">
                                            <h1 className="novel-title">{novel.title}</h1>
                                            <h3 className="novel-author">{novel.author}</h3>
                                        </div>
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