import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(2, 3)
  },
  title: {
    color: 'white'
  },
  hover: {
    '&:hover': {
        color: '#fff',
    }
  }
}));

const ResoucesTable = ({resources}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} style={{backgroundColor: '#530f77', borderRadius: 15}} elevation={5}>
      <div className={classes.titleSection}>
        <Typography
          variant="h6"
          id="tableTitle"
          className={classes.title}
          component="div"
        >
          Resources
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          component={Link}
          className={classes.hover}
          to="/dashboard/add-resources"
        >
          Add Resource
        </Button>
      </div>
      <Table aria-label="simple table" style={{backgroundColor: 'white'}}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="left">Descriptions</TableCell>
            <TableCell align="left">URL</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.length === 0 ? (
              <TableRow>
                  <TableCell scope="row">
                      You have not added any Resources yet.
                  </TableCell>
              </TableRow>
            ) : resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell component="th" scope="row">
                {resource.title}
              </TableCell>
              <TableCell align="left">{resource.description}</TableCell>
              <TableCell align="left">{resource.url}</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ResoucesTable;
