import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppContainer from './AppContainer';
import { axios, BASE_URL } from '../utils/utils';

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
    const [state, setState] = React.useState({
        rows: [],
        loading: false,
        error: null
    });

    React.useEffect(() => {
        setState({...state, loading: true});
        axios.get(`${BASE_URL}/api/users`)
            .then(res => {
                setState({...state, rows: res.data, loading: false});
            })
            .catch(err => {
                console.log(err.response);
                setState({...state, error: err.response.data, loading: false});
            });
    }, []);

    return (
        <AppContainer>
            <div>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Name
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    Email
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    Phone
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
                                <StyledTableCell component="th" scope="row">
                                    Loading.....
                                </StyledTableCell>
                            ) : state.rows.length === 0 ? (
                                <StyledTableCell component="th" scope="row">
                                    No Data Available.
                                </StyledTableCell>
                            ) : state.rows.map((row) => (
                                <StyledTableRow key={row.name}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.email}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.fat}
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        {row.carbs}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </AppContainer>
    )
}

export default UsersTable;
