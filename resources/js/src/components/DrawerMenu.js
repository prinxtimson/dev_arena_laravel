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
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DropDownMenu from './DropDownMenu';
import { Link } from 'react-router-dom';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
}));


function DrawerMenu({ window, children }) {
    const classes = useStyles();
    const theme = useTheme();
    const [anchorE1, setAnchorE1] = React.useState(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
  
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
        <div className={classes.toolbar} />
        <Divider />
        <List>
            <MenuItem
              component={Link}
              to="/dashboard/users"
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="User" />
            </MenuItem>
        </List>
      </div>
    );
  
    const container = window !== undefined ? () => window().document.body : undefined;
  
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar} color="transparent">
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
            <div className={classes.grow} />
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={2} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton 
              aria-label="avatar"
              color="inherit"
              onClick={handleClick}
            >
                <Avatar alt="Remy Sharp" src="../../../views/public/no_img.jpg">
                    RS
                </Avatar>
            </IconButton>
            <DropDownMenu
              handleClose={handleClose}
              anchorE1={anchorE1}
            />
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden lgUp implementation="css">
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
