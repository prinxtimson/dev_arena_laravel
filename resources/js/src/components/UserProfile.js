import React from 'react';
import AppContainer from './AppContainer';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Snackbar from '@material-ui/core/Snackbar';
import { useParams } from "react-router-dom";
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
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
        minHeight: 250
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
        marginTop: theme.spacing(5)
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
    },
    red: {
        backgroundColor: 'red',
        color: 'white',
        marginLeft: theme.spacing(2),
    },
    green: {
        backgroundColor: 'green',
        color: 'white',
        marginLeft: theme.spacing(2),
    },
    editText: {
        //marginTop: theme.spacing(2),
        color: theme.palette.grey[500],
    }
}));


const UserProfile = () => {
const classes = useStyles();
const {id} = useParams();
const [loading, setLoading] = React.useState(true);
const [formLoading, setFormLoading] = React.useState(false);
const [user, setUser] = React.useState(null);
const [isEdit, setIsEdit] = React.useState(false);
const [msg, setMsg] = React.useState(null);
const [data, setData] = React.useState({
    firstname: '',
    lastname: '',
    github: '',
    phone: '',
    dev_stack: '',
    location: '',

})

const toggleEdit = () => {
    setIsEdit(!isEdit);
}

const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);
    axios.put(`${BASE_URL}/api/users/${id}`, data)
        .then(res => {
            setUser(res.data.user);
            setMsg(res.data.msg);
            return res.data.user.profile
        })
        .then(profile => {
            setData({
                ...data,
                firstname: profile.firstname,
                lastname: profile.lastname,
                location: profile.location ? profile.location : '',
                github: profile.github ? profile.github : '',
                phone: profile.phone ? profile.phone : '',
                dev_stack: profile.dev_stack ? profile.dev_stack : '',
            });
            setFormLoading(false);
        })
        .catch(err => {
            console.log(err.response);
            if (err.response.statusText === "Unauthorized") {
                location.replace('/login');
            }
            setFormLoading(false);
        })
}

React.useEffect(() => {
  axios.get(`${BASE_URL}/api/users/${id}`)
      .then(res => {
          setUser(res.data);
          //console.log(res.data)
          return res.data.profile
      })
      .then(profile => {
        setData({
            ...data,
            firstname: profile.firstname,
            lastname: profile.lastname,
            location: profile.location ? profile.location : '',
            github: profile.github ? profile.github : '',
            phone: profile.phone ? profile.phone : '',
            dev_stack: profile.dev_stack ? profile.dev_stack : '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.log(err.response);
        if (err.response.statusText === "Unauthorized") {
            location.replace('/login');
        }
        setLoading(false);
      })
}, [])

    return (
        <AppContainer>
            <Snackbar
                open={Boolean(msg)}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                autoHideDuration={8000} 
                onClose={() => setMsg(null)}
            >
                <Alert
                    onClose={() => setMsg(null)} 
                    severity="success"
                    variant="filled"
                >
                    {msg}
                </Alert>
            </Snackbar>
            {loading ? (
                <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '30%' }} />
                </Skeleton>
            ) : ( 
            <Card className={classes.root} elevation={5}>
                <CardContent className={classes.content}>
                    <Avatar
                        alt={user?.name}
                        src={user?.avatar}
                        className={classes.avatar}
                    >
                        {`${user?.profile?.firstname.charAt(0)}${user?.profile?.lastname.charAt(0)}`}
                    </Avatar> 
                    <div>          
                        <ListItemText
                            primary={user?.name}
                            secondary={user?.roles[0]?.name}
                            primaryTypographyProps={{
                                variant: 'h6',
                                component: 'h6'
                            }}
                            style={{flexGrow: 0}}
                        />
                        <Button
                            type="submit"
                            variant="text"
                            color="primary"
                            size="small"
                            onClick={toggleEdit}
                            className={classes.editText}
                        >
                            {isEdit ? 'Cancel' : 'Edit'}
                        </Button>
                    </div>
                    {user.roles[0]?.name === 'developer' && 
                    (
                        <Chip
                            size="small"
                            label={user.projects.length >= 2 ? 'Not available' : 'Available'}
                            className={user.projects.length >= 2 ? classes.red : classes.green}
                        />
                    )}                       
                </CardContent>               
            </Card>
            )}
            <div className={classes.clear} style={{margin: loading ? 20 : 0}} />
            <Container >
                <Grid container spacing={5} justify="flex-start">
                    <Grid item sm={12} md={isEdit ? 4 : user?.roles[0]?.name === 'developer' ? 4 : 12}>
                        {loading ? (
                          <Skeleton variant="rect" width="100%">
                            <div style={{ paddingTop: '70%' }} />
                          </Skeleton>
                        ) : ( 
                        <Paper className={classes.paper} elevation={5}>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Firstname" 
                                        secondary={user?.profile?.firstname}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Lastname"
                                        secondary={user?.profile?.lastname}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Email Address"
                                        secondary={user?.email}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Phone Number" 
                                        secondary={user?.profile.phone}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                {user.roles[0]?.name === 'developer' &&  (
                                    <ListItem>
                                        <ListItemText
                                            primary="Location"
                                            secondary={user?.profile.location}
                                            primaryTypographyProps={{
                                                variant: 'subtitle2',
                                                component: 'h6'
                                            }}
                                        />
                                    </ListItem>
                                )}
                                {user.roles[0]?.name === 'developer' &&  (
                                    <ListItem>
                                        <ListItemText
                                            primary="Github"
                                            secondary={user?.profile.github}
                                            primaryTypographyProps={{
                                                variant: 'subtitle2',
                                                component: 'h6'
                                            }}
                                        />
                                    </ListItem>
                                )}
                                {user.roles[0]?.name === 'developer' &&  (
                                    <ListItem>
                                        <ListItemText
                                            primary="Dev Stack"
                                            secondary={user?.profile.dev_stack}
                                            primaryTypographyProps={{
                                                variant: 'subtitle2',
                                                component: 'h6'
                                            }}
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                        )}
                    </Grid>
                    {isEdit ? (
                        <Grid item sm={12} md={8}>
                            <Paper className={classes.paper} elevation={5}>
                                <form className={classes.form} noValidate>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="firstname"
                                                label="Firstname"
                                                name="firstname"
                                                autoFocus
                                                value={data.firstname}
                                                onChange={e => setData({...data, firstname: e.target.value})}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="lastname"
                                                label="Lastname"
                                                name="lastname"
                                                value={data.lastname}
                                                onChange={e => setData({...data, lastname: e.target.value})}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="phone_number"
                                                label="Phone Number"
                                                name="phone"
                                                value={data.phone}
                                                onChange={e => setData({...data, phone: e.target.value})}
                                            />
                                        </Grid>
                                        {user?.roles[0].name === 'developer' && (
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="location"
                                                    label="Location"
                                                    name="location"
                                                    value={data.location}
                                                    onChange={e => setData({...data, location: e.target.value})}
                                                />
                                            </Grid>
                                        )}
                                        {user?.roles[0].name === 'developer' && (
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="github_url"
                                                    label="Github URL"
                                                    name="github_url"
                                                    value={data.github}
                                                    onChange={e => setData({...data, github: e.target.value})}
                                                />
                                            </Grid>
                                        )}
                                        {user?.roles[0].name === 'developer' && (
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="dev_stack"
                                                    label="Dev Stack"
                                                    name="dev_stack"
                                                    value={data.dev_stack}
                                                    onChange={e => setData({...data, dev_stack: e.target.value})}
                                                />
                                            </Grid>
                                        )}   
                                        <Grid item xs={12} md={6} />
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                onClick={handleSubmit}
                                                disabled={formLoading || !data.firstname || !data.lastname}
                                                //className={classes.submit}
                                            >
                                                Save Changes
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Paper>
                        </Grid>
                    ) : user?.roles[0]?.name === 'developer' && (
                        <Grid item sm={12} md={8}>
                            {loading ? (
                            <Skeleton variant="rect" width="100%">
                                <div style={{ paddingTop: '57%' }} />
                            </Skeleton>
                            ) : (                                
                            <UserProjects projects={user?.projects} />  
                            )}                      
                        </Grid>
                    )}
                </Grid>
            </Container>
        </AppContainer>
    )
}

export default UserProfile;
