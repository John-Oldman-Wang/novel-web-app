import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import PermIdentity from '@material-ui/icons/PermIdentity';
import Button from 'material-ui/Button';
import StarBorder from '@material-ui/icons/StarBorder';

const styles = theme => ({
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flex: `1 0 0%`,
        flexDirection: 'column',
        overflow: `hidden`,
    },
    content: {
        flex: '1 0 auto',
        padding: `8px`,
        paddingBottom: `0px`
    },
    cover: {
        width: 130,
        height: 130,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing.unit,
    },
});

function RowCard(props) {
    const { onClick,classes, theme, title, image, author, category } = props;
    // console.log(theme)
    return (
        <Card className={classes.card}>
            <CardMedia
                className={classes.cover}
                image={image || "https://qidian.qpic.cn/qdbimg/349573/23813/180"}
                title={title || "title"}
            />
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography noWrap variant="title">
                        {title || ''}
                    </Typography>
                    <div className={classes.card}>
                        <PermIdentity style={{
                            fontSize: `1rem`,
                            marginRight: `8px`,
                            color: `rgba(0, 0, 0, 0.87)`,
                            height: `1.46429em`
                        }} />
                        <Typography style={{
                            flex: `1 0 0%`,
                        }} noWrap align='left' variant="body1" color="textSecondary">
                            {author || ''}
                        </Typography>
                    </div>
                    <Typography noWrap align='left' variant="button">
                        {(category || '玄幻 / 东方玄幻').replace('-', ' / ')}
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <Button onClick={onClick} className={classes.btn} size="small" color="primary">
                        继续阅读
                    </Button>
                    <StarBorder />
                </div>
            </div>
        </Card>
    );
}

RowCard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RowCard);