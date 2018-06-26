import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Divider from '@material-ui/core/Divider';

import category from '../json/category.json';

const stopPropagationDefaultFun = (e)=>{
    return true
    if(e.target!==document.body){
        return true
    }
    e.preventDefault();
	e.stopPropagation();
    return true;
	// return false;
}


const styles = (theme)=>({
    categoryList:{
        maxHeight: `360px`,
        overflow: 'scroll',
    },
    categoryItem: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
})

class DrawerMenu extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            categoryOpen: false
        }
    }
    // shouldComponentUpdate(nextprops,nextstate){
    //     const flag = !(Object.keys(this.props).every(item=>{
    //         return this.props[item] == nextprops[item]
    //     })&&Object.keys(this.state).every(item=>{
    //         return this.state[item] == nextstate[item]
    //     }))
    //     console.log('flag', flag)
    //     return flag
    //     // console.log(this.props,nextprops);
    //     // console.log(this.props.classes == nextprops.classes)
    //     // console.log(this.state,nextstate)
    //     // return true
    // }
    render(){
        const { open, onClose, className, classes } = this.props;
        // if(open){
        //     var ele = document.body;
        //     ele.ontouchmove = ele.onscroll= ele.onmousewheel = stopPropagationDefaultFun;
        // }
        return (<SwipeableDrawer 
            anchor="left"
            open={open}
            onClose={()=>{
                onClose();
                var ele = document.body;
                ele.ontouchmove = ele.onscroll= ele.onmousewheel = null;
            }}
        ><div className={className}><List component="nav">
            <ListItem onClick={()=>{
                this.setState({
                    categoryOpen: !this.state.categoryOpen
                })
            }} button>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="小说分类" />
            </ListItem>
            <Collapse in={this.state.categoryOpen}>
                <List
                    className={classes.categoryList} component="div" disablePadding>
                    {category.sort((a,b)=>{
                        return b.num-a.num;
                    }).map((item,index)=>{
                        return (
                            <ListItem className={classes.categoryItem}  key={index+''+item.num} button>
                                <Avatar>
                                    <InboxIcon />
                                </Avatar>
                                <ListItemText primary={`${item.category}`} secondary={`${item.num}本`} />
                            </ListItem>
                        );
                    })}
                </List>
            </Collapse>
            <Divider/>
            <ListItem button>
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
            </ListItem>
        </List></div></SwipeableDrawer>)
    }
}

export default withStyles(styles)(DrawerMenu)