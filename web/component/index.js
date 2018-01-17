import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {CardPanel , CardTitle , Card, Autocomplete, Col, Row, Input, Navbar, NavItem, Icon, Button } from 'react-materialize'


import Search from './searchHeader.js'
var xhr = new XMLHttpRequest()
export class Index extends Component {
    constructor(props){
        super(props)
        this.state={
           novels:[] 
        }
        // console.log()
        window.index=this
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
        return(
            <div>
                <Navbar brand='无限小说' right>
                    <NavItem href="javascript:void(0)" onClick={()=>{
                        this.props.history.push('/search?key=')
                    }}>
                        <Icon left>search</Icon>搜索
                    </NavItem>
                    {/* <NavItem href='get-started.html'><Icon>view_module</Icon></NavItem>
                    <NavItem href='get-started.html'><Icon>refresh</Icon></NavItem>
                    <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem> */}
                </Navbar>
                <ul className="row">
                    {this.state.novels.map(novel=>{
                        return (
                            <li className="col s4" key={novel._id}>
                                {/* <Card > */}
                                <Link to={'/novel?v=' + novel._id} rel={novel.title}>
                                    <CardTitle style={{fontSize: "0px"}} reveal image="">
                                        <div className="novel-img">
                                            <div className="imgbox"></div>
                                            <div className="img">
                                                <img src={novel.image} alt={novel.title} />
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "15px" }} className="novel-message">
                                            <h1 className="novel-title">{novel.title}</h1>
                                            <h3 className="novel-author">{novel.author}</h3>
                                        </div>
                                    </CardTitle>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
    componentDidMount(){
    }
}