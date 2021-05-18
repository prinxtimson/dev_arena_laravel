import React from 'react';
import AppContainer from './AppContainer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { useParams } from "react-router-dom";
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import UserProjects from './UserProjects';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
    root: {
      borderRadius: 15,
      margin: theme.spacing(3),
    },
    media: {
      height: 250,
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
        bottom: '30px',
        left: '20px',
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


const UserProfile = () => {
const classes = useStyles();
const {userId} = useParams();
const [loading, setLoading] = React.useState(true);
const [user, setUser] = React.useState({});

const handleUploadAvatar = (img) => {
    const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }; 
      const file = new FormData(); 
      file.append('avatar', img);

      axios.put(`${BASE_URL}/me/upload`, file, config)
            .then(res => {
                console.log(res.data)
            })
}

React.useEffect(() => {
  axios.get(`${BASE_URL}/api/users/${userId}`)
      .then(res => {
          setUser(res.data);
          setLoading(false);
      })
      .catch(err => {
        console.log(err.response);
        setLoading(false);
      })
}, [])

    return (
        <AppContainer>
            {loading ? (
                <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '30%' }} />
                </Skeleton>
            ) : ( 
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                    />
                    <CardContent className={classes.content}>
                        <Avatar
                            alt={user && user.name}
                            src={user && user.avatar}
                            className={classes.avatar}
                        >
                            {user && user.profile && `${user.profile.firstname.charAt(0)}${user.profile.lastname.charAt(0)}`}
                        </Avatar>
                        <div>
                            <Typography variant="h6">
                                {user && user.name}
                            </Typography>
                            <Typography 
                                component="caption"
                                className={classes.caption}
                            >
                                {user && user.roles && user.roles[0].name}
                            </Typography>
                        </div>
                    </CardContent>
                </CardActionArea>
            </Card>
            )}
            <div className={classes.clear} style={{margin: loading ? 20 : 0}} />
            <Container >
                <Grid container spacing={5} justify="flex-start">
                    <Grid item sm={12} md={4}>
                        {loading ? (
                          <Skeleton variant="rect" width="100%">
                            <div style={{ paddingTop: '70%' }} />
                          </Skeleton>
                        ) : ( 
                        <Paper className={classes.paper}>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Firstname" 
                                        secondary={user && user.profile.firstname}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Lastname"
                                        secondary={user && user.profile.lastname}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Email Address"
                                        secondary={user && user.email}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Phone Number" 
                                        secondary={user && user.profile.phone}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Github"
                                        secondary={user && user.profile.github}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Dev Stack"
                                        secondary={user && user.profile.dev_stack}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                        )}
                    </Grid>
                    <Grid item sm={12} md={8}>
                        {loading ? (
                          <Skeleton variant="rect" width="100%">
                            <div style={{ paddingTop: '57%' }} />
                          </Skeleton>
                        ) : (                                
                          <UserProjects projects={user && user.projects} />  
                        )}                      
                    </Grid>
                </Grid>
            </Container>
        </AppContainer>
    )
}

export default UserProfile;
