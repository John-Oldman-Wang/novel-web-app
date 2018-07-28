import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Search from '@material-ui/icons/Search';

import category from '../json/category.json';


const styles = (theme)=>({
    categoryList:{
        maxHeight: `360px`,
        overflow: 'scroll',
    },
    categoryItem: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    margin: {
        margin: theme.spacing.unit*2,
    },
})

class DrawerMenu extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            categoryOpen: false
        }
    }
    render(){
        const { open, onClose, className, classes } = this.props;
        return (<Drawer 
            anchor="left"
            open={open}
            onClose={onClose}
        ><div className={className}>
        <div className={classes.margin}>
            <Grid container spacing={8} alignItems="flex-end">
            <Grid item>
                <Search />
            </Grid>
            <Grid item>
                <TextField onClick={()=>{
                    this.props.history.push('/search')
                }} id="input-with-icon-grid" label="" placeholder="狂神"/>
            </Grid>
            </Grid>
        </div>
        <List component="nav">
            <ListItem onClick={()=>{
                this.setState({
                    categoryOpen: !this.state.categoryOpen
                })
            }} button>
                <ListItemIcon>
                    <LibraryBooksIcon />
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
                                    <ChromeReaderModeIcon />
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
                    <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="开发人员" />
            </ListItem>
        </List></div></Drawer>)
    }
}

export default withStyles(styles)(DrawerMenu)