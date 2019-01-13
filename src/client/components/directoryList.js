import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Collapse from '@material-ui/core/Collapse';
import ListIcon from '@material-ui/icons/List';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

const styles = (theme) => ({
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
        super(props);
        this.state = {
            open: false
        };
    }
    render() {
        const { classes, onClick, list } = this.props;

        return (
            <React.Fragment>
                <Divider />
                <List component="ul" disablePadding>
                    <ListItem
                        disableGutters
                        component="li"
                        divider
                        button
                        onClick={(e) => {
                            this.setState({
                                open: !this.state.open
                            });
                        }}>
                        <ListItemIcon className={classes.listItem}>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="目录" />
                        {this.state.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="ul">
                            {list.slice(0, 50).map((item, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        onClick={() => {
                                            onClick(item);
                                        }}
                                        component="li"
                                        button>
                                        <ListItemText
                                            component="a"
                                            primary={(item.serialName ? item.serialName + ' ' : `第${index + 1}章`) + item.title || ''}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Collapse>
                </List>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DirectoryList);
