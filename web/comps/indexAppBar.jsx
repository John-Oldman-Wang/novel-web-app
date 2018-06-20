import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Divider from '@material-ui/core/Divider';
const styles =theme=>({
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    loginBtn:{
        paddingLeft: `0px`,
        paddingRight: `0px`,
        width: `48px`,
        minWidth: `auto`
    },
    listwrap: {
        // width: '100%',
        width: 250,
        backgroundColor: theme.palette.background.paper,
    }
}); 
class IndexAppBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false,
            anchorEl: null,
            open: false
        };
    }
    handleChange(e) {
        this.setState({
            isLogin: !this.state.isLogin
        })
    }
    render() {
        const { classes } = this.props;
        const { isLogin, anchorEl } = this.state
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon onClick={()=>{
                                this.setState({
                                    open: true
                                })
                            }}/>
                        </IconButton>
                        <Typography align='center' variant="title" color="inherit" className={classes.flex}>
                            Woeble阅读
                        </Typography>
                            {!isLogin ? 
                                <Button className={classes.loginBtn} onClick={(e => {
                                this.handleChange(e)
                            })} color="inherit">Login</Button> 
                            : 
                            <div>
                                <IconButton
                                    aria-owns={'menu-appbar'}
                                    aria-haspopup="true"
                                    onClick={(e) => {
                                        this.setState({
                                            anchorEl: e.target
                                        })
                                    }}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={!!anchorEl}
                                    onClose={(e) => {
                                        e.stopPropagation()
                                        this.setState({
                                            anchorEl: null
                                        })
                                    }}
                                ><MenuItem onClick={(e) => {
                                        e.stopPropagation()
                                        this.setState({
                                            anchorEl: null
                                        })
                                    }}>个人中心</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        e.stopPropagation()
                                        this.setState({
                                            anchorEl: null
                                        })
                                    }}>历史记录</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        e.stopPropagation()
                                        this.setState({
                                            anchorEl: null,
                                            isLogin: false
                                        })
                                    }}>退出登陆</MenuItem>
                                </Menu>
                            </div>
                        }</Toolbar>
                </AppBar>
                <SwipeableDrawer 
                    anchor="left"
                    open={this.state.open}
                    onClose={(e=>{
                        this.setState({
                            open: false
                        })
                    })}
                    onOpen={(e => {
                        this.setState({
                            open: true
                        })
                    })}
                ><div className={classes.listwrap}><List component="nav">
                    <ListItem button>
                        <ListItemIcon>
                            <InboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Inbox" />
                    </ListItem>
                        <Divider/>
                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drafts" />
                    </ListItem>
                </List></div>
                </SwipeableDrawer>
            </div>
        );
    }
}

IndexAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IndexAppBar);