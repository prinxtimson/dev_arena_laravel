import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import { Link, NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  title: {
    flex: '1 1 100%',
    margin: theme.spacing(2, 3),
    color: 'white'
  },
  link: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none'
    }
  }
}));

const UserProjects = ({projects}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} style={{backgroundColor: '#530f77', borderRadius: 15}} elevation={5}>
      <Typography
        variant="h6"
        id="tableTitle"
        component="div"
        className={classes.title}>
        Projects
      </Typography>
      <Table aria-label="simple table"  style={{backgroundColor: 'white'}}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="left">Start</TableCell>
            <TableCell align="left">Expected End Date</TableCell>
            <TableCell align="left">End Date</TableCell>
            <TableCell align="left">Weeks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.length === 0 ? (
              <TableRow>
                  <TableCell scope="row">
                      No assign project available yet.
                  </TableCell>
              </TableRow>
            ) : projects.map((project) => {
                  let a = moment(project.end_at);
                  let b = moment.now();
                  return (
                    <TableRow key={project.name} >
                      <TableCell component="th" scope="row">
                        <NavLink to={`projects/${project.id}`} className={classes.link}>
                          {project.name}
                        </NavLink>
                      </TableCell>
                      <TableCell align="left">
                        {moment(project.start_at).format('MMM Do YYYY')}
                      </TableCell>
                      <TableCell align="left">
                        {moment(project.est_end_at).format('MMM Do YYYY')}
                      </TableCell>
                      <TableCell align="left">
                        {moment(project.end_at).format('MMM Do YYYY')}
                      </TableCell>
                      <TableCell align="left">
                        {a.diff(b, 'weeks') + 'Weeks'}
                      </TableCell>
                    </TableRow>
                  )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default UserProjects;
