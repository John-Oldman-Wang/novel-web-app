import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {Slider,Slide,CardPanel , CardTitle , Card, Autocomplete, Col, Row, Input, Navbar, NavItem, Icon, Button } from 'react-materialize'


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
            <div className='index'>
                <Navbar brand='Woeble阅读' right>
                    <NavItem href='javascript:void(0)' onClick={()=>{
                        this.props.history.push('/search?key=')
                    }}>
                        <Icon left>search</Icon>搜索
                    </NavItem>
                    {/* <NavItem href='get-started.html'><Icon>view_module</Icon></NavItem>
                    <NavItem href='get-started.html'><Icon>refresh</Icon></NavItem>
                    <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem> */}
                </Navbar>
                <Slider indicators={true}>
                
                    <Slide
                        src="http://lorempixel.com/580/250/nature/1"
                        title="This is our big Tagline!">
                        <Link to="search?key=">Here's our small slogan.</Link>
                    </Slide>
                    
                    <Slide
                        src="http://lorempixel.com/580/250/nature/2"
                        title="Left aligned Caption"
                        placement="left">
                        Here's our small slogan.
                    </Slide>
                    <Slide
                        src="http://lorempixel.com/580/250/nature/3"
                        title="Right aligned Caption"
                        placement="right">
                        Here's our small slogan.
                    </Slide>
                </Slider>
                <ul className='row novelist'>
                    {this.state.novels.map(novel=>{
                        return (
                            <li className="col s4" key={novel._id}>
                            <Link to={'/novel?v=' + novel._id} rel={novel.title}>

                                <div className="novel-img">
                                    <div className="imgbox">
                                    </div>
                                    <div className="img">
                                        <img className="img" src={novel.image} alt={novel.title}/>
                                    </div>
                                </div>
                                {/* <div className="small card" style={{maxHeight:'80%'}}>
                                    <div className="card-image" style={{maxHeight:'80%'}}>
                                    <img className="" src={novel.image} />
                                    <span className="card-title"></span>
                                    </div>
                                <div className="card-reveal">
                                    <span className="card-title grey-text text-darken-4"><i className="material-icons right">close</i></span></div>
                                    <div className="card-action novel-header">
                                        <h6 className="novel-title">
                                            {novel.title}
                                        </h6>
                                        
                                        <h6 className="novel-title">{novel.author}</h6>
                                    </div>
                                </div> */}
                                {/* <Card className='small'
                                    header={<CardTitle  image={novel.image}></CardTitle>}
                                    actions={[
                                        <Link to={'/novel?v=' + novel._id} rel={novel.title}>
                                            <h6 className='novel-title'>{novel.title}</h6>
                                            <h6 className='novel-title'>{novel.title}</h6>
                                        </Link>
                                ]} >""
                                </Card> */}
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