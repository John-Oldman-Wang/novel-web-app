import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import { Slider, Slide, CardPanel, CardTitle , Autocomplete, Col, Row, Input, Navbar, NavItem, Icon, Button } from 'react-materialize'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import Menu, { MenuItem} from 'material-ui/Menu';
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import CancelIcon from 'material-ui-icons/Cancel'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import SearchIcon from 'material-ui-icons/Search'
import GridList from 'material-ui/GridList'
import {GridListTile} from 'material-ui/GridList'
import Paper from 'material-ui/Paper'
import { CircularProgress } from 'material-ui/Progress'
// import Input, { InputLabel, InputAdornment } from 'material-ui/Input'

import Alternating from './alternating.js'
import SearchMeunItem from './searchMeunItem.js'
import Search from './searchHeader.js'
import request from '../plugin/request.js'
import { cipher, decipher } from '../plugin/cryptoBro.js'

const styles = theme => ({
    appbar:{
        position: 'relative',
    },
    toolBar:{
        display: 'flex',
        justifyContent: 'space-between'
    },
    appbarTitle:{
        userSelect: 'none',
        cursor: 'default',
        margin: '0px'
    },
    searchBtn:{
        marginRight: '10px'
    },
    iconWrap:{
        marginRight: '-10px',
        display: 'flex',
        flexWrap: 'nowrap'
    },
    novelItem:{
        textAlign: 'center'
    },
    progress:{
        textAlign: 'center',
        paddingTop: '120px'
    },
    fadeIn:{
        animation: 'fade-in',
        animationDuration: '1.5s',
    },
    searchInput:{
        width: '60%'
    }
})

class GuttersGrid extends Component {
    constructor(props){
        super(props)
        this.state = {
            isSearchOpen: false,
            open: !!0,
            novels:[]
        }
        var xhr = new request()
        xhr.get('/index?pbj=1',(e)=>{
            var json = JSON.parse(decipher(e.responseText))
            this.setState({
                novels: json.novels
            })
        }).send()
    }
    toggleDrawer(){
        this.setState({
            open: !this.state.open
        })
    }
    render() {
        const {classes} =this.props
        return(<React.Fragment>
        <AppBar
            title="weoble"
            className={classes.appbar}
        >
        <Toolbar className={classes.toolBar}>
            <IconButton
                aria-label="icon"
            >
                <svg fill='#000000' height='48' viewBox='0 0 24 24' width='48' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M0 0h24v24H0z' fill='none'/>
                    <path fill='rgba(0,0,0,.5)' d='M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z'/>
                </svg>
            </IconButton>
            {
                !this.state.isSearchOpen ? <p className={classes.appbarTitle}>Woeble阅读</p>:<Input className={classes.searchInput} type='text' autoFocus onKeyUp={(e)=>{
                    if(e.keyCode=='13'){
                        this.props.history.push('/search?key=' + e.target.value)
                    }
                }}/>
            }
            <span className={classes.iconWrap}>
                <IconButton onClick={()=>{
                    this.setState({
                        isSearchOpen: !this.state.isSearchOpen
                    })}}>{this.state.isSearchOpen ? <CancelIcon />:<SearchIcon />}
                </IconButton>
                <IconButton
                    aria-label="Menu"
                    onClick={this.toggleDrawer.bind(this)}
                ><MenuIcon />
                </IconButton>
            </span>
        </Toolbar>
        </AppBar>
        <Drawer open={this.state.open} onClose={()=>{this.toggleDrawer()} }>
            <SearchMeunItem />
            <MenuItem>Menu Item</MenuItem>
            <MenuItem>Menu Item 2</MenuItem>
        </Drawer>
            <Alternating ></Alternating>
            {!!this.state.novels.length?(<GridList
                cols={3}
                cellHeight={240}
                className={classes.fadeIn}
            >{this.state.novels.map((item)=>{
                    return <GridListTile
                        title={item.title}
                        key={item.image} className={classes.novelItem}>
                        <Link to={'/novel?v=' + item._id}><img title={item.title} src={item.image} /></Link>
                        </GridListTile>
                })}
            </GridList>) : <div className={classes.progress}>
                    <CircularProgress size={60} thickness={3}/>
                    <p>正在加载</p>
                </div>}
        </React.Fragment>
        )
    }
}

GuttersGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};
var Test=withStyles(styles)(GuttersGrid)
export function Index (props){
    // render(){
        return <Test {...props} />
    // } 
}
/*
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
        var classes={}
        return (
            <div className='index'>
                <Test />
                <Navbar brand='Woeble阅读' right>
                    <NavItem href='javascript:void(0)' onClick={()=>{
                        this.props.history.push('/search?key=')
                    }}>
                        <Icon left>search</Icon>搜索
                    </NavItem>
                </Navbar>
                <Slider indicators={true}>
                    <Slide
                        src="1.jpg"
                        title="狂神"
                        >
                        <Link to="novel?v=5a4fd3557b78fd2acc16c56e">狂神</Link>
                    </Slide>
                    
                    <Slide
                        src="2.jpg"
                        title={""}
                        placement="left">
                        <Link to="novel?v=5a4fd3597b78fd2acc16c705"></Link>
                    </Slide>
                    <Slide
                        src="3.jpg"
                        title={""}
                        placement="right">
                        <Link to="novel?v="></Link>
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
}*/