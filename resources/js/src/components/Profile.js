import React from 'react';
import AppContainer from './AppContainer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Skeleton from '@material-ui/lab/Skeleton';
import UserProjects from './UserProjects';
import ResourcesTable from './ResourcesTable';
import ProfileForm from './ProfileForm';
import {UserContext} from '../context/GlobalState';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
    root: {
      borderRadius: 15,
      margin: theme.spacing(3),
      minHeight: 250
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
    edit: {
        position: 'absolute',
        top: '100px',
        left: '90px',
        zIndex: 1000,
        borderRadius: 50,
        height: 30,
        width: 30,
        backgroundColor: theme.palette.grey[500],
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    },
    fileInput: {
       display: 'none', 
    }
}));

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-prevent-tabpanel-${index}`}
        aria-labelledby={`scrollable-prevent-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            {children}
          </Box>
        )}
      </div>
    );
  }

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

  function a11yProps(index) {
    return {
      id: `scrollable-prevent-tab-${index}`,
      'aria-controls': `scrollable-prevent-tabpanel-${index}`,
    };
  }

const Profile = () => {
const classes = useStyles();
const {state, updateUser} = React.useContext(UserContext)
const [value, setValue] = React.useState(0);
const [inputRef, setInputRef] = React.useState(null);

const handleChange = (e, newValue) => {
    setValue(newValue);
}

const handleUploadAvatar = (img) => {

      const file = new FormData(); 
      file.append('avatar', img);

      axios.post(`${BASE_URL}/api/upload-avatar`, file)
            .then(res => {
                updateUser({user: res.data.user})
                console.log(res.data)
            })
}

    return (
        <AppContainer>
            <input
                id="avatar"
                name="avatar"
                className={classes.fileInput}
                onChange={(e) => handleUploadAvatar(e.target.files[0])}
                type="file"
                accept="image/*" ref={ref => setInputRef(ref)} />
            {state.loading ? (
                <Skeleton variant="rect" width="100%">
                <div style={{ paddingTop: '30%' }} />
                </Skeleton>
            ) : ( 
            <Card className={classes.root} elevation={5}>
                <CardContent className={classes.content}>
                        <div style={{position: 'relative'}}>
                            <Avatar
                                alt={state.user && state.user.name}
                                src={state.user && state.user.avatar}
                                className={classes.avatar}
                            >
                                {state.user && `${state.user.profile.firstname.charAt(0)}${state.user.profile.lastname.charAt(0)}`}
                            </Avatar>
                            <div 
                                className={classes.edit} 
                                onClick={() => inputRef.click()}
                            >
                                <EditIcon />
                            </div>
                        </div>
                        <ListItemText
                            primary={state.user && state.user.name}
                            secondary={state.user && state.user.roles[0].name}
                            primaryTypographyProps={{
                                variant: 'h6',
                                component: 'h6'
                            }}
                        />
                    </CardContent>
                
                <CardActions className={classes.actions}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        
                    >
                        {state.user?.roles[0].name === 'developer' && (
                            <AntTab label="Projects" {...a11yProps(0)} />
                        )}
                       {state.user?.roles[0].name === 'developer' && (
                            <AntTab label="Resouces" {...a11yProps(1)} />
                        )}
                        {state.user?.roles[0].name === 'developer' && (
                            <AntTab label="Edit Profile" {...a11yProps(2)} />
                        )}
                    </Tabs>
                </CardActions>
            </Card>
            )}
            <div className={classes.clear} style={{margin: state.loading ? 20 : 0}} />
            <Container >
                <Grid container spacing={5} justify="flex-start">
                    <Grid item sm={12} md={4}>
                        {state.loading ? (
                          <Skeleton variant="rect" width="100%">
                            <div style={{ paddingTop: '70%' }} />
                          </Skeleton>
                        ) : ( 
                        <Paper className={classes.paper} elevation={5}>
                            <List>
                                <ListItem>
                                    <ListItemText
                                        primary="Firstname" 
                                        secondary={state.user && state.user.profile.firstname}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Lastname"
                                        secondary={state.user && state.user.profile.lastname}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Email Address"
                                        secondary={state.user && state.user.email}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText 
                                        primary="Phone Number" 
                                        secondary={state.user && state.user.profile.phone}
                                        primaryTypographyProps={{
                                            variant: 'subtitle2',
                                            component: 'h6'
                                        }}
                                    />
                                </ListItem>
                                {state.user?.roles[0].name === 'developer' && (
                                    <ListItem>
                                        <ListItemText 
                                            primary="Location" 
                                            secondary={state.user && state.user.profile.location}
                                            primaryTypographyProps={{
                                                variant: 'subtitle2',
                                                component: 'h6'
                                            }}
                                        />
                                    </ListItem>
                                )}
                                {state.user?.roles[0].name === 'developer' && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Github"
                                            secondary={state.user && state.user.profile.github}
                                            primaryTypographyProps={{
                                                variant: 'subtitle2',
                                                component: 'h6'
                                            }}
                                        />
                                    </ListItem>
                                )}
                                {state.user?.roles[0].name === 'developer' && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Dev Stack"
                                            secondary={state.user && state.user.profile.dev_stack}
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
                    <Grid item sm={12} md={8}>
                        {state.loading ? (
                          <Skeleton variant="rect" width="100%">
                            <div style={{ paddingTop: '57%' }} />
                          </Skeleton>
                        ) : (
                            <>
                                {state.user?.roles[0].name === 'developer' ? (
                                    <>
                                        <TabPanel value={value} index={0}>
                                            <UserProjects projects={state.user.projects} />
                                        </TabPanel>
                                        <TabPanel value={value} index={1}>
                                            <ResourcesTable resources={state.user.resources} />
                                        </TabPanel>
                                        <TabPanel value={value} index={2}>
                                            <ProfileForm />
                                        </TabPanel>
                                    </>
                                ) : (
                                    
                                    <ProfileForm />
                                   
                                )}
                                
                            </>
                        )}                      
                    </Grid>
                </Grid>
            </Container>
        </AppContainer>
    )
}

export default Profile;
