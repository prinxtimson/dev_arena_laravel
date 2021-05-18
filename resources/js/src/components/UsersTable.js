import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import AppContainer from './AppContainer';
import { axios, BASE_URL } from '../utils/utils';
import { UserContext } from '../context/GlobalState';
import { Link, NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    btnContainer: {
      margin: theme.spacing(2.5, 0),
    },
    paper: {
        padding: theme.spacing(3)
    },
    table: {
        borderWidth: 0
    }
}));

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

const RenderDeleteConfirmationDialog = ({open, user, handleClose, handleDelete}) => (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Delete Confirmation
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                You are about to delete {`${user && user.name}`} from the platform, click DELETE if you wish to continue or CANCEL to cancel
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

const UsersTable = () => {
    const classes = useStyles();
    const context = React.useContext(UserContext);
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [state, setState] = React.useState({
        rows: [],
        loading: false,
        error: null,
        msg: null
    });

    const handleDelete = () => {
        handleClose();
        axios.delete(`${BASE_URL}/api/users/${user.id}`)
            .then(() => {
                setState({
                    ...state,
                    msg: 'User removed successfully',
                    loading: false
                });
                const newRows = state.rows.filter(row => row.id !== user.id);
                setState({...state, rows: newRows});
                setUser(null)
            })      
    }

    const handleOpen = currentUser => {
        setUser(currentUser)
        setOpen(true)
    }

    const handleOnClick = (id) => {
        history.pushState(`/profile/${id}`)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

    React.useEffect(() => {
        setState({...state, loading: true});
        axios.get(`${BASE_URL}/api/users`)
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
            <RenderDeleteConfirmationDialog
                open={open}
                user={user}
                handleClose={handleClose}
                handleDelete={handleDelete}
            />
            <Paper variant="outlined" className={classes.paper}>
                <div className={classes.btnContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component={Link}
                        to="/dashboard/add-user"
                    >
                        Add User
                    </Button>
                </div>
                <TableContainer variant="elevation" elevation={0} component={Paper}>
                    <Table aria-label="customized table" >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Name
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    Username
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    Email
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    Role
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    Actions
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.loading ? (
                                <TableRow>
                                    <StyledTableCell scope="row">
                                        Loading.....
                                    </StyledTableCell>
                                </TableRow>
                            ) : state.rows.length === 0 ? (
                                <TableRow>
                                    <StyledTableCell scope="row">
                                        No Data Available.
                                    </StyledTableCell>
                                </TableRow>
                            ) : state.rows.map((row) => (
                                <StyledTableRow key={row.email}>
                                    <StyledTableCell
                                        scope="row"
                                        //component={NavLink}
                                        //to={`profile/${row.id}`}
                                        //onClick={() => handleOnClick(row.id)}
                                        >
                                        <NavLink to={`profile/${row.id}`}>{row.name}</NavLink>
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.username}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.email}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.roles[0] && row.roles[0].name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.roles[0] && row.roles[0].name === 'super-admin' ? null : row.roles[0].name === 'admin' && context.state.user && context.state.user.roles[0].name === 'super-admin' ? (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleOpen(row)}
                                            >
                                                Delete
                                            </Button>
                                        ) : row.roles[0].name === 'developer' ? (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="small"
                                                onClick={() => handleOpen(row)}
                                            >
                                                Delete
                                            </Button>
                                        ) : null}
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[20]}
                                    rowsPerPage={state.rows.length}
                                    count={state.rows.length}
                                    page={page}
                                    onChangePage={handleChangePage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
        </AppContainer>
    )
}

export default UsersTable;
