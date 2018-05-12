import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import Menu, { MenuItem } from 'material-ui/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import SwipeableDrawer from 'material-ui/SwipeableDrawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Divider from 'material-ui/Divider';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 0,
    },
    loginBtn: {
        paddingLeft: `0px`,
        paddingRight: `0px`,
        width: `48px`,
        minWidth: `auto`
    },
    listwrap: {
        // width: '100%',
        width: 250,
        backgroundColor: theme.palette.background.paper,
    },
    content: {

    },
});
class OtherAppBar extends React.Component {
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
        const { classes, title } = this.props;
        const { isLogin, anchorEl } = this.state
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <HomeIcon onClick={() => {
                                this.props.history.push('/')
                            }} />
                        </IconButton>
                        <Typography noWrap variant="title" color="inherit" className={classes.flex}>
                            {title||"..."}
                        </Typography>
                        <div>
                            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                                <MenuIcon onClick={() => {
                                    this.setState({
                                        open: true
                                    })
                                }} />
                            </IconButton>
                            {!isLogin ? <Button className={classes.loginBtn} onClick={(e => {
                                this.handleChange(e)
                            })} color="inherit">Login</Button> :
                                <IconButton
                                    aria-owns={'menu-appbar'}
                                    aria-haspopup="true"
                                    onClick={(e) => {
                                        this.setState({
                                            anchorEl: e.target
                                        })
                                    }}
                                    color="inherit">
                                    <AccountCircle />
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
                                    >
                                        <MenuItem onClick={(e) => {
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
                                </IconButton>}
                        </div>
                    </Toolbar>
                </AppBar>
                <SwipeableDrawer
                    anchor="left"
                    open={this.state.open}
                    onClose={(e => {
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
                    <Divider />
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

OtherAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OtherAppBar);