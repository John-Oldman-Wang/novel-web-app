import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {Slider,Slide,CardPanel , CardTitle , Card, Autocomplete, Col, Row, Input, Navbar, NavItem, Icon, Button } from 'react-materialize'

// import Card from 'material-ui/Card'
import { CardMedia, CardActions, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import withStyles from 'material-ui/styles/withStyles'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'

import { cipher, decipher } from '../plugin/cryptoBro.js'

import Search from './searchHeader.js'
import request from '../plugin/request.js'

export class Index extends Component {
    constructor(props){
        super(props)
        this.state={
           novels:[] 
        }
        window.p1.goto(50)
        var xhr = new request()
        xhr.get('/index?pbj=1', (e) => {
            var json = JSON.parse(decipher(e.responseText))
            this.setState({
                novels: json.novels
            })
            window.p1.goto(100)
        })
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