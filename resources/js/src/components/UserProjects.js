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
    margin: theme.spacing(2, 3)
  }
}));

const UserProjects = ({projects}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Typography
        variant="h6"
        id="tableTitle"
        component="div"
        className={classes.title}>
        Projects
      </Typography>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="left">Developer</TableCell>
            <TableCell align="left">Start</TableCell>
            <TableCell align="left">End</TableCell>
            <TableCell align="left">Status</TableCell>
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
                  let a = moment(project.end);
                  let b = moment.now();
                  return (
                    <TableRow key={project.name}>
                      <TableCell component="th" scope="row">
                        {project.name}
                      </TableCell>
                      <TableCell align="left">{row.calories}</TableCell>
                      <TableCell align="left">
                        {moment(project.start).format('MMM Do YYYY')}
                      </TableCell>
                      <TableCell align="left">
                        {moment(project.end).format('MMM Do YYYY')}
                      </TableCell>
                      <TableCell align="left">
                        <Chip color="primary" label={a.diff(b) <= 0 ? 'Completed' : 'In progress'} />
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
