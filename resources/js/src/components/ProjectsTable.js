import React from 'react';
import moment from 'moment';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppContainer from './AppContainer';
import Badge from '@material-ui/core/Badge';
import { Link } from 'react-router-dom';
import { axios, BASE_URL } from '../utils/utils';
import ProjectDailog from './ProjectDailog';
import Skeleton from '@material-ui/lab/Skeleton';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import UploadDocDialog from './UploadDocDialog';

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

const RenderDeleteConfirmationDialog = ({open, row, handleClose, handleDelete}) => (
  <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
  >
      <DialogTitle id="alert-dialog-title">
          Confirm Delete
      </DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
              You are about to delete {`${row && row.name}`} from the platform, click DELETE if you wish to continue or CANCEL to cancel
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
              Delete
          </Button>
      </DialogActions>
  </Dialog>
)

const Row = ({row, handleUpdateRows, handleDeleteRow}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [project, setProject] = React.useState(row);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [openDel, setOpenDel] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [dev, setDev] = React.useState(false);
  const [weeks, setWeeks] = React.useState();
  const issueCount = row.issues.length;
  let a = moment(project.end);
  let b = moment();

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setIsEdit(false);
    setOpen(false);
  };

  const handleDocDialogOpen = () => {
    setOpen2(true);
  };

  const handleDocDialogClose = () => {
    setOpen2(false);
  };

  const handleDelDialogOpen = () => {
    setOpenDel(true);
  };

  const handleDelDialogClose = () => {
    setOpenDel(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    setIsEdit(true);
    handleDialogOpen();
  }

  const handleAssignDev = () => {
    handleDialogOpen();
    setDev(true)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = (data) => {
    setProject(data);
  }

  const handleCloseProject = () => {
    handleClose();
    axios.put(`${BASE_URL}/api/projects/close/${row.id}`)
        .then(res => {
          //console.log(res.data)
            setMsg(`Project ${row.name} had been closed successfuly`);
            handleUpdateRows(res.data.project);
            setProject(res.data.project);
        }) 
        .catch(err => {
          console.log(err.response);
          setError(err.response.data);
      })
  }

  const handleDeleteProject = () => {
    handleClose();
    handleDelDialogClose();
    axios.delete(`${BASE_URL}/api/projects/${row.id}`)
        .then(res => {
            setMsg(`Project ${row.name} had been deleted successfuly`);
            handleDeleteRow(row.id);
        }) 
        .catch(err => {
          console.log(err.response);
          setLoading(false);
          setError(err.response.data);
      })
  }

  const handleSaveEdit = (data) => {
    //e.preventDefault();
    setLoading(true);
    axios.put(`${BASE_URL}/api/projects/${project.id}`, data)
        .then(res => {
            setLoading(false);
            setMsg(res.data.msg);
            setProject(res.data.project);
            handleUpdateRows(res.data.project)
            setIsEdit(false);
        })
        .catch(err => {
            console.log(err.response);
            setLoading(false);
            setError(err.response.data);
        })
  }

  return (
    <React.Fragment>
      <ProjectDailog
        open={open}
        handleClose={handleDialogClose}
        handleSaveEdit={handleSaveEdit}
        isEdit={isEdit}
        dev={dev}
        handleEdit={handleEdit}
        handleUpdate={handleUpdate}
        project={project}
        loading={loading}
        error={error}
      />
      <UploadDocDialog
        open={open2}
        handleClose={handleDocDialogClose}
        handleUpdate={handleUpdate}
        project={project}
        error={error}
        setError={setError}
      />
      <RenderDeleteConfirmationDialog
          open={openDel}
          row={row}
          handleClose={handleDelDialogClose}
          handleDelete={handleDeleteProject}
      />
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
      <StyledTableRow>
        <StyledTableCell component="th" scope="row" onClick={handleDialogOpen}>
          <Badge badgeContent={issueCount} color="error">{project.name}</Badge>
        </StyledTableCell>
        <StyledTableCell align="left">
          {moment(project.start).format('MMM Do YYYY')}
        </StyledTableCell>
        <StyledTableCell align="left">
          {moment(project.expected_end).format('MMM Do YYYY')}
        </StyledTableCell>
        <StyledTableCell align="left">
          {moment(project.end).format('MMM Do YYYY')}
        </StyledTableCell>
        <StyledTableCell align="left">
          {a.diff(b, 'weeks') + 'Weeks'}
        </StyledTableCell>
        <StyledTableCell align="right">
          <IconButton
            aria-label="row menu"
            size="small"
            onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <DropMenu
            id={project.id}
            handleClose={handleClose}
            anchorEl={anchorEl}
            handleEdit={handleEdit}
            handleDelDialogOpen={handleDelDialogOpen}
            handleCloseProject={handleCloseProject}
            handleAssignDev={handleAssignDev}
            handleDocDialogOpen={handleDocDialogOpen}
          />
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  )
}

const DropMenu = ({anchorEl, handleClose, handleEdit, id, handleAssignDev, handleCloseProject, handleDelDialogOpen, handleDocDialogOpen}) => {

  return (
    <Menu
      id="menu"
      anchorEl={anchorEl}
      keepMounted
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem component={Link} onClick={handleClose} to={`/dashboard/projects/${id}`}>View</MenuItem>
      <MenuItem onClick={handleAssignDev}>Assign Dev</MenuItem>
      <MenuItem onClick={handleEdit}>Edit</MenuItem>
      <MenuItem onClick={handleDocDialogOpen}>Upload Docs</MenuItem>
      <MenuItem onClick={handleCloseProject}>Close</MenuItem>
      <MenuItem onClick={handleDelDialogOpen}>Delete</MenuItem>
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
  const [page, setPage] = React.useState(0);
  const [state, setState] = React.useState({
    data: [],
    loading: false,
    per_page: 0,
    total: 0,
    error: null,
    msg: null
  });

  React.useEffect(() => {
    setState({...state, loading: true});
    axios.get(`${BASE_URL}/api/projects`)
        .then(res => {
            console.log(res.data)
            setState({...state, ...res.data, loading: false});
        })
        .catch(err => {
            console.log(err.response);
            setState({...state, error: err.response.data, loading: false});
        });
  }, []);

  const handleUpdateRows = (project) => {
    const currentRows = state.data;
    const index = currentRows.findIndex(row => row.id === project.id);
    currentRows.splice(index, 1, project);
    setState({...state, data: [...currentRows]});
  }

  const handleDeleteRow = (id) => {
    const newRows = state.data.filter(row => row.id !== id);
    setState({...state, data: newRows, per_page: state.per_page - 1});
  }

  const handleChangePage = (event, newPage) => {
    const number = newPage + 1
    axios.get(`${BASE_URL}/api/projects?page=${number}`)
        .then(res => {
            console.log(res.data)
            setPage(newPage);
            setState({...state, ...res.data, loading: false});
        })
        .catch(err => {
            console.log(err.response);
            setState({...state, error: err.response.data, loading: false});
        });
  };

  return (
    <AppContainer>
      {state.loading ? (
        <Skeleton variant="rect" width="100%">
          <div style={{ paddingTop: '60%' }} />
        </Skeleton>
      ) : ( 
      <Paper variant="outlined" className={classes.paper}>
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
        <TableContainer component={Paper}>
          
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Start</TableCell>
                <TableCell align="left">Expected End Date</TableCell>
                <TableCell align="left">End Date</TableCell>
                <TableCell align="left">Weeks</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {state.data.length === 0 ? (
                  <TableRow>
                      <StyledTableCell scope="row">
                          No Data Available.
                      </StyledTableCell>
                  </TableRow>
                ) : state.data.map((row) => (
                <Row
                  row={row}
                  key={row.name}
                  handleDeleteRow={handleDeleteRow}
                  handleUpdateRows={handleUpdateRows} />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[20]}
                  rowsPerPage={state.per_page}
                  count={state.total}
                  page={page}
                  onChangePage={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
      )}
  </AppContainer>
  )
}

export default ProjectsTable;
