import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

import NavigateNext from '@material-ui/icons/NavigateNext';
import BookMark from '@material-ui/icons/Bookmark';
import BookMarkBorder from '@material-ui/icons/BookmarkBorder';
import HomeIcon from '@material-ui/icons/Home';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import CloseIcon from '@material-ui/icons/Close';

import SwipeableDrawer from 'material-ui/SwipeableDrawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Divider from 'material-ui/Divider';
// import Button from 'material-ui/Button';

const styles = theme => ({
    root: {
        height: 380,
    },
    speedDial: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        left: theme.spacing.unit * 3,
    },
    listwrap:{
        width: `250px`
    }
});
function Mark(props){
    const { isMark } = props
    return (isMark ? <BookMark color={props.color} /> : <BookMarkBorder color={props.color}/>)
}

class SpeedMenu extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            open: false,
            Dopen: false,
            hidden: false,
        };
    }
    handleVisibility(){
        this.setState({
            open: false,
            hidden: !this.state.hidden,
        });
    };

    handleClick(){
        this.setState({
            open: !this.state.open,
        });
    };

    handleOpen(){
        if (!this.state.hidden) {
            this.setState({
                open: true,
            });
        }
    };

    handleClose(){
        this.setState({
            open: false,
        });
    };
    render(){
        const { classes, theme } = this.props;
        const { hidden, open } = this.state;
        const actions = [
            { icon: <NavigateNext color={'primary'} />, name: 'Next' },
            {
                icon: <NavigateNext color={'primary'} style={{
                    transform: `rotate(180deg)`
                }} />, name: 'Prev'
            },
            { icon: <Mark isMark={true} color={'primary'} />, name: 'mark' },
            { icon: <HomeIcon color={'primary'} />, name: 'Home' },
            { icon: <FormatListNumbered onClick={e=>{
                e.stopPropagation()
                this.setState({
                    open: false,
                    Dopen: true
                })
            }} color={'primary'} />, name: 'list' },
        ];
        return (<React.Fragment><SpeedDial
            ariaLabel="SpeedDial openIcon example"
            className={classes.speedDial}
            hidden={hidden}
            icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
            onBlur={(e)=>{this.handleClose(e)}}
            onClick={(e)=>{this.handleClick(e)}}
            onClose={(e)=>{this.handleClose(e)}}
            onFocus={(e)=>{this.handleOpen(e)}}
            onMouseEnter={(e)=>{this.handleOpen(e)}}
            onMouseLeave={(e)=>{this.handleClose(e)}}
            open={open}
            style={{
                opacity: !open?`0.7`:'1'
            }}
        >
            {actions.map(action => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={(e)=>{
                        console.log(action)
                    }}
                />
            ))}
        </SpeedDial>
            <SwipeableDrawer
                anchor="right"
                open={this.state.Dopen}
                onClose={(e => {
                    this.setState({
                        Dopen: false
                    })
                })}
                onOpen={(e => {
                    this.setState({
                        Dopen: true
                    })
                })}
            ><div className={classes.listwrap}><List component="nav">
                <ListItem button>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                        <ListItemText primary="InboxInboxInboxasdasd InboxInboxInboxInboxInbox" />
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
        </React.Fragment>);
    }
}

SpeedMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SpeedMenu);