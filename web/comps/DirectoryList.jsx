import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Collapse from '@material-ui/core/Collapse';
import ListIcon from '@material-ui/icons/List';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    root: {},
    nested: {
        // paddingLeft: theme.spacing.unit * 2,
    },
    listItem: {
        marginRight: `0px`
    }
});

class DirectoryList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }
    render() {
        const { classes, theme, onClick, list } = this.props;
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
                        {(list || []).map((item, index) => {
                            if (index > 100)
                                return null;
                            return (<ListItem key={index} onClick={() => {
                                onClick(item)
                            }} component="li" button>
                                <ListItemText component="a" primary={(item.serialName ? item.serialName + " " : "") + item.title || ""} />
                            </ListItem>)
                        })}
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