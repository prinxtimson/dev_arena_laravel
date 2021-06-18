import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {yellow, green} from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import AppContainer from './AppContainer';
import { axios, BASE_URL } from '../utils/utils';
import { UserContext } from '../context/GlobalState';
import { NavLink, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    btnContainer: {
      margin: theme.spacing(2.5, 0),
      display: 'flex',
      justifyContent: 'space-between'
    },
    grid: {
        margin: theme.spacing(1, 0)
    },
    paper: {
        marginBottom: theme.spacing(2),
        backgroundColor: '#530f77',
        borderRadius: 15,
    },
    table: {
        borderWidth: 0
    },
    red: {
        backgroundColor: 'red',
        color: 'white'
    },
    green: {
        backgroundColor: 'green',
        color: 'white'
    },
    hover: {
        '&:hover': {
            color: '#fff',
        }
    }
}));

const DisableButton = withStyles(theme => ({
    root: {
        color: yellow[600],
        borderColor: yellow[600],
        '&:hover': {
          borderColor: yellow[700],
          color: yellow[700]
        },
      },
}))(Button);

const EnableButton = withStyles(theme => ({
    root: {
        color: green[600],
        borderColor: green[600],
        '&:hover': {
          borderColor: green[800],
          color: green[800]
        },
      },
}))(Button);

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
                You are about to delete {`${user?.name}`} from the platform, click DELETE if you wish to continue or CANCEL to cancel
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
    let history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [role, setRole] = React.useState('');
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

    const handleDeactivate = (row) => {
        axios.put(`${BASE_URL}/api/users/disable/${row}`)
            .then(res => {
                const index = state.rows.findIndex(val => val.id === row);
                state.rows.splice(index, 1, res.data);
                setState({...state, rows: [...state.rows], loading: false});
            })
            .catch(err => {
                console.log(err.response);
                setState({...state, error: err.response.data, loading: false});
            });
    }

    const handleReactivate = (row) => {
        axios.put(`${BASE_URL}/api/users/enable/${row}`)
            .then(res => {
                console.log(res.data)
                const index = state.rows.findIndex(val => val.id === row);
                state.rows.splice(index, 1, res.data);
                setState({...state, rows: [...state.rows], loading: false});
            })
            .catch(err => {
                console.log(err.response);
                setState({...state, error: err.response.data, loading: false});
            });
    }

    const handleOnSelectChange = (text) => {
        setState({...state, loading: true});
        if (text) { 
            setRole(text);
            history.push(`?role=${text}`);
            axios.get(`${BASE_URL}/api/users/search/${text}`)
            .then(res => {
                setState({...state, rows: res.data.data, loading: false});
            })
            .catch(err => {
                console.log(err.response);
                setState({...state, error: err.response.data, loading: false});
            });
        }else {
            setRole('');
            history.push('/dashboard/users')
            axios.get(`${BASE_URL}/api/users`)
            .then(res => {
                setState({...state, rows: res.data.data, loading: false});
            })
            .catch(err => {
                console.log(err.response);
                setState({...state, error: err.response.data, loading: false});
            });
        }
    }

    const handleOnExport = () => {
        const query = new URLSearchParams(window.location.search)
        const role = query.get('role');
        if (role) {
          window.location.href = `${BASE_URL}/users/export?role=${role}`
        }else {
          window.location.href = `${BASE_URL}/users/export`
        }
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
                console.log(res.data)
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
            <Paper elevation={5} className={classes.paper}>
                <Grid container spacing={2} justify="center" alignItems="center" style={{padding: 30}}>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleOnExport}
                            className={classes.hover}
                        >
                            Export Table
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{backgroundColor: 'whitesmoke', borderRadius: 5, padding: 10}}>
                        <Grid container spacing={5}>
                            <Grid item xs>
                                <TextField
                                    id="role"
                                    select
                                    fullWidth
                                    margin="dense"
                                    label="Select Role"
                                    value={role}
                                    onChange={e => handleOnSelectChange(e.target.value)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    variant="outlined"
                                >
                                    <option />
                                    <option value="admin">
                                        Admin
                                    </option>
                                    <option value="developer">
                                        Developer
                                    </option>
                                </TextField> 
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <TableContainer variant="elevation" style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}} elevation={0} component={Paper}>
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
                                        <NavLink to={`profile/${row.id}`}>{row.name}</NavLink> {row.roles[0] && row.roles[0].name === 'developer' && (
                                            <Chip
                                                size="small"
                                                label={row.projects.length >= 2 ? 'Not available' : 'Available'}
                                                className={row.projects.length >= 2 ? classes.red : classes.green}
                                                />
                                            )}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.username}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.email}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.roles[0]?.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {row.roles[0]?.name === 'super-admin' ? null : row.roles[0]?.name === 'admin' && context.state.user?.roles[0].name === 'super-admin' ? (
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    {row.deleted_at ? (
                                                        <EnableButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleReactivate(row.id)}
                                                        >
                                                            Reactivate
                                                        </EnableButton>
                                                    ) : (
                                                        <DisableButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleDeactivate(row.id)}
                                                        >
                                                            Deactivate
                                                        </DisableButton>
                                                    )}
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() => handleOpen(row)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        ) : row.roles[0].name === 'developer' ? (
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    {row.deleted_at ? (
                                                        <EnableButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleReactivate(row.id)}
                                                        >
                                                            Reactivate
                                                        </EnableButton>
                                                    ) : (
                                                        <DisableButton
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => handleDeactivate(row.id)}
                                                        >
                                                            Deactivate
                                                        </DisableButton>
                                                    )}
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        onClick={() => handleOpen(row)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Grid>
                                            </Grid>
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
