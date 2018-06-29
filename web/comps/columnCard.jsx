import React from 'react';
// import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import Button from 'material-ui/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    card: {
        maxWidth: 160,
        margin: `0 auto 5px`
    },
    content:{
        padding: `4px 4px 0px`,
        fontSize: `0.8em`,
    },
    btn:{
        marginRight: 0,
        padding: 4
    },
    media: {
        height: 0,
        paddingTop: '120%', // 1:1
    },
    author:{
        textAlign: `right`,
        color: `#999`
    },
    action:{
        justifyContent: 'flex-end',
        padding: `2px`
    }
});
function ColumbCard(props) {
    const { classes,onClick,image,title,author } = props
    return (<Card onClick={onClick} className={classes.card}>
        <CardMedia
            className={classes.media}
            image={image||"https://qidian.qpic.cn/qdbimg/349573/23813/180"}
            title={title || 'title'}
        />
        <CardContent className={classes.content}>
            <Typography noWrap variant="body1" component="h5">
                {title||'title'}
            </Typography>
            <Typography noWrap variant="caption" align="right" color="textSecondary" component="p">
                {author || 'author'}
            </Typography>
        </CardContent>
        <CardActions className={classes.action}>
            {/* <Button  className={classes.btn} variant="raised" size="small" color="primary">
                阅读
            </Button> */}
        </CardActions>
    </Card>)
}

export default withStyles(styles)(ColumbCard);