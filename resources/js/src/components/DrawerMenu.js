import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PersonIcon from '@material-ui/icons/Person';
import List from '@material-ui/core/List';
import FolderIcon from '@material-ui/icons/Folder';
import NewFolderIcon from '@material-ui/icons/CreateNewFolder';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MenuItem from '@material-ui/core/MenuItem';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Skeleton from '@material-ui/lab/Skeleton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Avatar from '@material-ui/core/Avatar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DropDownMenu from './DropDownMenu';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/GlobalState';
import NotificationsMenu from './NotificationsMenu';
import { axios, BASE_URL } from '../utils/utils';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: 'white'
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  logo: {
    [theme.breakpoints.up('md')]: {
        width: '12rem',
        height: '5%',
    },
    [theme.breakpoints.down('md')]: {
        width: '10rem',
        height: '5%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '8rem',
        height: '5%',
    },
  },
  logo2: {
    [theme.breakpoints.down('md')]: {
        width: '10rem',
        height: '5%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '8rem',
        height: '5%',
    },
  },
  appBar: {
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    padding: theme.spacing(0.5, 0)
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 20,
    margin: 4,
  },
  drawerPaper: {
    width: drawerWidth,
    borderWidth: 0,
  },
  space: {
    marginBottom: theme.spacing(5)
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: 'whitesmoke'
  },
  grow: {
    flexGrow: 1,
  },
  nested: {
    paddingLeft: theme.spacing(4),
    fontSize: 12
  },
  nameDiv: {
    margin: theme.spacing(2),
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
  },
}));


function DrawerMenu({ window, children }) {
    const classes = useStyles();
    const {state, onNotificationRead} = React.useContext(UserContext);
    const theme = useTheme();
    const [anchorE1, setAnchorE1] = React.useState(null);
    const [anchorE2, setAnchorE2] = React.useState(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleNotificationClick = (event) => {
      setAnchorE2(event.currentTarget);
    };
  
    const handleNotificationClose = () => {
      setAnchorE2(null);
    };

    const handleOnFocus = () => {
      axios.get(`${BASE_URL}/api/mark-notification`)
          .then(res => {
            //console.log(res.data)
            onNotificationRead(res.data);
          })
          .catch(err => {
            console.log(err.response);
         });
    }    
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const handleClick = (event) => {
      setAnchorE1(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorE1(null);
    };
  
    const drawer = (
      <div>        
        <div className={classes.toolbar}>
          <Avatar className={classes.logo} variant="square" alt="Dev Arena" src="/images/logo.png" >
            Dev Arena
          </Avatar>
        </div>
        <List>
          <div className={classes.nameDiv}>
          <ListItem>
            <ListItemAvatar>
              <Avatar alt={state.user?.name} src={state.user?.avatar}>
                {`${state.user?.profile.firstname.charAt(0)}${state.user?.profile.lastname.charAt(0)}`}
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={state.user?.name}
              secondary={state.user?.roles[0].name} 
            />
          </ListItem>
          </div>
          {state.loading ? null : state.user?.roles[0].name === 'developer' ? (
            <>
              <MenuItem
                component={Link}
                to="/dashboard/projects"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <BusinessCenterIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      fontWeight: '500'
                    }
                  }}
                  primary="Projects" />
              </MenuItem>
              <MenuItem
                component={Link}
                to="/dashboard/daily-reports"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      fontWeight: '500'
                    }
                  }}
                 primary="Daily Reports" />
              </MenuItem>
              <MenuItem
                component={Link}
                to="/dashboard/resources"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      fontWeight: '500'
                    }
                  }}
                 primary="Resources" />
              </MenuItem>
              <List dense>
                <MenuItem
                  component={Link}
                  className={classes.nested}
                  to="/dashboard/add-resources"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <NewFolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      style: {
                        fontWeight: '500'
                      }
                    }}
                   primary="Add Resources" />
                </MenuItem>
              </List>
            </>
          ) : (
            <>
              <MenuItem
                component={Link}
                to="/dashboard/users"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Users"
                  primaryTypographyProps={{
                    style: {
                      fontWeight: '500'
                    }
                  }} />
              </MenuItem>
              <List dense>
                <MenuItem
                  component={Link}
                  className={classes.nested}
                  to="/dashboard/add-user"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <PersonAddIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      style: {
                        fontWeight: '500'
                      }
                    }}
                   primary="Add User" />
                </MenuItem>
              </List>
              <MenuItem
                component={Link}
                to="/dashboard/daily-reports"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      fontWeight: '500'
                    }
                  }}
                  primary="Daily Reports" />
              </MenuItem>
              <MenuItem
                component={Link}
                to="/dashboard/projects"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <BusinessCenterIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      fontWeight: '500'
                    }
                  }}
                 primary="Projects" />
              </MenuItem>
              <List dense>
                <MenuItem
                  component={Link}
                  className={classes.nested}
                  to="/dashboard/add-project"
                  onClick={handleDrawerToggle}
                >
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      style: {
                        fontWeight: '500'
                      }
                    }}
                   primary="Add Project" />
                </MenuItem>
              </List>
              <MenuItem
                component={Link}
                to="/dashboard/resources"
                onClick={handleDrawerToggle}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    style: {
                      fontWeight: '500'
                    }
                  }}
                 primary="Resources" />
              </MenuItem>
            </>
          )}   
        </List>
      </div>
    );
  
    const container = window !== undefined ? () => window().document.body : undefined;
  
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar elevation={0} position="fixed" className={classes.appBar} color="inherit">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Avatar className={[classes.menuButton, classes.logo2].join(' ')} variant="square" alt="Dev Arena" src="/images/logo.png" >
              Dev Arena
            </Avatar>
            <div className={classes.grow} />
            <IconButton
              aria-label="notifications"
              color="inherit"
              onClick={handleNotificationClick}
              >
              <Badge badgeContent={state.notifications && state.notifications.count} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {state.loading ? (
              <Skeleton variant="circle" width={40} height={40} />
            ) : (
              <IconButton 
                aria-label="avatar"
                color="inherit"
                onClick={handleClick}
              >
                <Avatar alt={state.user?.name} src={state.user?.avatar}>
                  {`${state.user?.profile.firstname.charAt(0)}${state.user?.profile.lastname.charAt(0)}`}
                </Avatar>
              </IconButton>
            )}
            {!state.loading && (
              <NotificationsMenu
              notifications={state.notifications && state.notifications.data}
              anchorE2={anchorE2}
              handleClose={handleNotificationClose}
              handleOnFocus={handleOnFocus}
            />
            )}
            
            <DropDownMenu
              handleClose={handleClose}
              anchorE1={anchorE1}
            />
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden lgUp implementation="js">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden mdDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.space} />
          {children}          
        </main>
      </div>
    );
}

DrawerMenu.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default DrawerMenu;
