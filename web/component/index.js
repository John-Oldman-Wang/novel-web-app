import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'



// import { Slider, Slide, CardPanel, CardTitle , Autocomplete, Col, Row, Input, Navbar, NavItem, Icon, Button } from 'react-materialize'

import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import Menu, { MenuItem} from 'material-ui/Menu';
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Input, { InputLabel, InputAdornment } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import SearchIcon from 'material-ui-icons/Search'


import SearchMeunItem from './searchMeunItem.js'
import Search from './searchHeader.js'
import request from '../plugin/request.js'
import { cipher, decipher } from '../plugin/cryptoBro.js'

const styles = theme => ({
    appbar:{
        display: 'flex',
        justifyContent: 'space-around'
    },
    menuButton:{
        marginRight: '-40px',
        // marginRight: '2em'
    }
})

class GuttersGrid extends Component {
    constructor(){
        super()
        this.state = {
            isSearchOpen: false,
            open: !!0
        }
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
            showMenuIconButton={true}
        >
        <Toolbar className={classes.appbar}>
            <IconButton
                
                aria-label="icon"
            >

            </IconButton>
            <p>Woeble阅读</p>
            <IconButton
                aria-label="Menu"
                className={classes.menuButton}
                onClick={this.toggleDrawer.bind(this)}
            >
                <MenuIcon />
            </IconButton>
        </Toolbar>
        </AppBar>
        <Drawer open={this.state.open} onClose={()=>{this.toggleDrawer()} }>
            <SearchMeunItem />
            <MenuItem>Menu Item</MenuItem>
            <MenuItem>Menu Item 2</MenuItem>
        </Drawer></React.Fragment>
        )
    }
}

// GuttersGrid.propTypes = {
//     classes: PropTypes.object.isRequired,
// };
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