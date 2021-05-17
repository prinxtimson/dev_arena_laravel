import React from 'react';
import moment from 'moment';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppContainer from './AppContainer';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import { axios, BASE_URL } from '../utils/utils';
import ProjectDailog from './ProjectDailog';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  title: {
    flex: '1 1 100%',
    margin: theme.spacing(2, 3)
  },
  btnContainer: {
    margin: theme.spacing(2.5, 2),
  },
}));

const Row = ({row}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  let a = moment(row.end);
  let b = moment.now();

  const handleDialogOpen = () => {
    setOpen(true);
  };
  const handleDialogClose = () => {
    setIsEdit(false);
    setOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    setIsEdit(true);
    handleDialogOpen();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ProjectDailog
        open={open}
        handleClose={handleDialogClose}
        isEdit={isEdit}
        handleEdit={handleEdit}
      />
      <StyledTableRow>
        <StyledTableCell component="th" scope="row" onClick={handleDialogOpen}>
          {row.name}
        </StyledTableCell>
        <StyledTableCell align="left">
          {moment(row.start).format('MMM Do YYYY')}
        </StyledTableCell>
        <StyledTableCell align="left">
          {moment(row.end).format('MMM Do YYYY')}
        </StyledTableCell>
        <StyledTableCell align="left">
          {a.diff(b) <= 0 ? 'Completed' : 'In progress'}
        </StyledTableCell>
        <StyledTableCell align="right">
          <IconButton
            aria-label="row menu"
            size="small"
            onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <DropMenu
            handleClose={handleClose}
            anchorEl={anchorEl}
            handleEdit={handleEdit}
          />
        </StyledTableCell>
      </StyledTableRow>
    </>
  )
}

const DropMenu = ({anchorEl, handleClose, handleEdit}) => {

  return (
    <Menu
      id="menu"
      anchorEl={anchorEl}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem onClick={handleClose}>Assign Dev</MenuItem>
      <MenuItem onClick={handleEdit}>Edit</MenuItem>
      <MenuItem onClick={handleClose}>Delete</MenuItem>
    </Menu>
  )
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const ProjectsTable = () => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    rows: [],
    loading: false,
    error: null,
    msg: null
  });

  React.useEffect(() => {
    setState({...state, loading: true});
    axios.get(`${BASE_URL}/api/projects`)
        .then(res => {
            //console.log(res.data)
            setState({...state, rows: res.data.data, loading: false});
        })
        .catch(err => {
            console.log(err.response);
            setState({...state, error: err.response.data, loading: false});
        });
  }, []);

  return (
    <AppContainer>
      {state.loading ? (
        <Skeleton variant="rect" width="100%">
          <div style={{ paddingTop: '60%' }} />
        </Skeleton>
      ) : ( 
      <Paper variant="outlined" className={classes.paper}>
        <TableContainer component={Paper}>
          <div className={classes.btnContainer}>
            <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/dashboard/add-project"
            >
                Add Project
            </Button>
          </div>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Start</TableCell>
                <TableCell align="left">End</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {state.rows.length === 0 ? (
                  <TableRow>
                      <StyledTableCell scope="row">
                          No Data Available.
                      </StyledTableCell>
                  </TableRow>
                ) : state.rows.map((row) => (
                <Row row={row} key={row.name} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      )}
  </AppContainer>
  )
}

export default ProjectsTable;
