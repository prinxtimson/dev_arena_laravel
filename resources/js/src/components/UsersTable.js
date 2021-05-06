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
import Paper from '@material-ui/core/Paper';
import AppContainer from './AppContainer';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles((theme) => ({
    btnContainer: {
      margin: theme.spacing(2.5, 0),
    },
    paper: {
        padding: theme.spacing(3)
    }
}));

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
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

const UsersTable = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        rows: [],
        loading: false,
        error: null
    });

    React.useEffect(() => {
        setState({...state, loading: true});
        axios.get(`${BASE_URL}/api/users`)
            .then(res => {
                console.log(res.data)
                setState({...state, rows: res.data, loading: false});
            })
            .catch(err => {
                console.log(err.response);
                setState({...state, error: err.response.data, loading: false});
            });
    }, []);

    return (
        <AppContainer>
            <Paper variant="outlined" className={classes.paper}>
                <div className={classes.btnContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        href="/dashboard/add_user"
                    >
                        Add User
                    </Button>
                </div>
                <TableContainer variant="outlined" component={Paper}>
                    <Table aria-label="customized table">
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
                                    <StyledTableCell scope="row">
                                        {row.name}
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
                                        
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                
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
