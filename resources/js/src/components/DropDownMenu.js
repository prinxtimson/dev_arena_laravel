import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcone from '@material-ui/icons/Home';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import { UserContext } from '../context/GlobalState';

const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...props}
    />
  ));

  const useStyles = makeStyles(theme => ({
    nameDiv: {
      margin: theme.spacing(2, 3)
    },
  }));


function DropDownMenu({handleClose, anchorE1}) {
    const classes = useStyles();
    const {logout, state} = React.useContext(UserContext);

    return (
        <div>
           <StyledMenu
                id="customized-menu"
                anchorEl={anchorE1}
                keepMounted
                open={Boolean(anchorE1)}
                onClose={handleClose}
            >
                <div className={classes.nameDiv}>
                    <ListItemText 
                     primary={state.user && state.user.name}
                     secondary={state.user && state.user.email} 
                    />
                </div>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <HomeIcone fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/dashboard/change-password"
                  onClick={handleClose}
                >
                    <ListItemIcon>
                        <LockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Change Password" />
                </MenuItem>
                <MenuItem>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </MenuItem>
            </StyledMenu>
        </div>
    )
}

export default DropDownMenu;
