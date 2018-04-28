import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import ListIcon from '@material-ui/icons/List';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from 'material-ui/Divider';

const styles = theme => ({
    root:{},
    nested: {
        // paddingLeft: theme.spacing.unit * 2,
    },
    listItem:{
        marginRight: `0px`
    }
});

class DirectoryList extends React.Component {
    constructor(props){
        super(props)
        this.state={
            open: false
        }
    }
    render(){
        const { classes, theme, onClick } = this.props;
        return (<React.Fragment>
            <Divider />
            <List component="ul" disablePadding>
                <ListItem disableGutters component="li" divider button onClick={(e) => {
                    this.setState({
                        open: !this.state.open
                    })
                }}>
                    <ListItemIcon className={classes.listItem}>
                        <ListIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="目录" />
                    {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                    <List component="ul">
                        <ListItem onClick={onClick} component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem><ListItem component="li" button>
                            <ListItemText component="a" primary="第一章" />
                        </ListItem>
                        <ListItem component="li" button>
                            <ListItemText component="a" primary="第二章" />
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        </React.Fragment>);
    }
}

DirectoryList.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(DirectoryList);