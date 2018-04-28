import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/ModeEdit';
import Button from 'material-ui/Button';

const styles = theme => ({
    root: {
        height: 380,
    },
    speedDial: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3,
    },
});
const actions = [
    { icon: <ContentCopyIcon />, name: 'Copy' },
    { icon: <SaveIcon />, name: 'Save' },
    { icon: <PrintIcon />, name: 'Print' },
    { icon: <ShareIcon />, name: 'Share' },
    { icon: <DeleteIcon />, name: 'Delete' },
];
class SpeedMenu extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            open: false,
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
        // console.log(theme)
        return (<SpeedDial
            ariaLabel="SpeedDial openIcon example"
            className={classes.speedDial}
            hidden={hidden}
            icon={<SpeedDialIcon openIcon={<EditIcon />} />}
            onBlur={(e)=>{this.handleClose(e)}}
            onClick={(e)=>{this.handleClick(e)}}
            onClose={(e)=>{this.handleClose(e)}}
            onFocus={(e)=>{this.handleOpen(e)}}
            onMouseEnter={(e)=>{this.handleOpen(e)}}
            onMouseLeave={(e)=>{this.handleClose(e)}}
            open={open}
        >
            {actions.map(action => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={this.handleClick}
                />
            ))}
        </SpeedDial>);
    }
}

SpeedMenu.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SpeedMenu);