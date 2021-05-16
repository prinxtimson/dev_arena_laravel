import React from 'react';
import AppContainer from './AppContainer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ProjectsTable from './ProjectsTable';

const useStyles = makeStyles((theme) => ({
    root: {
      borderRadius: 15,
      margin: theme.spacing(3),
    },
    media: {
      height: 200,
    },
    actions: {
        padding: 0,
        justifyContent: 'flex-end'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: '-40px',
        left: '10px',
    },
    avatar: {
        width: theme.spacing(16),
        height: theme.spacing(16),
        marginRight: theme.spacing(2)
      },
    caption: {
        padding: 0,
    },
    clear: {
        clear: 'both',
    },
    paper: {
        padding: theme.spacing(2),
        borderRadius: 15,
    }
}));

const AntTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 72,
      marginRight: theme.spacing(4),
      '&:hover': {
        color: '#c7a936',
        opacity: 1,
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);

const Profile = () => {
const classes = useStyles();
const [value, setValue] = React.useState(0);

const handleChange = () => {}

    return (
        <AppContainer>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                    />
                    <CardContent className={classes.content}>
                        <Avatar
                            alt={'John Doe'}
                            src={'/static/images/cards/contemplative-reptile.jpg'}
                            className={classes.avatar}
                        />
                        <div>
                            <Typography variant="h6">
                                John Doe
                            </Typography>
                            <Typography 
                                component="caption"
                                className={classes.caption}
                            >
                                Developer
                            </Typography>
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions className={classes.actions}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        
                    >
                        <AntTab label="Projects" />
                        <AntTab label="Resouces" />
                        <AntTab label="Edit Profile" />
                    </Tabs>
                </CardActions>
            </Card>
            <div className={classes.clear} />
            <Container >
                <Grid container spacing={5} justify="flex-start">
                    <Grid item sm={12} md={4}>
                        <Paper className={classes.paper}>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Firstname" 
                                        secondary=""
                                        primaryTypographyProps={{
                                            variant: 'p',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Lastname"
                                        secondary=""
                                        primaryTypographyProps={{
                                            variant: 'p',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Email Address"
                                        secondary=""
                                        primaryTypographyProps={{
                                            variant: 'p',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Phone Number" 
                                        secondary=""
                                        primaryTypographyProps={{
                                            variant: 'p',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Github"
                                        secondary=""
                                        primaryTypographyProps={{
                                            variant: 'p',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Dev Stack"
                                        secondary=""
                                        primaryTypographyProps={{
                                            variant: 'p',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item sm={12} md={8}>
                        <ProjectsTable />
                    </Grid>
                </Grid>
            </Container>
        </AppContainer>
    )
}

export default Profile;
