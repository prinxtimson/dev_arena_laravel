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
  }
}));

const ResoucesTable = ({resources}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <div className={classes.titleSection}>
        <Typography
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Resources
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
        >
          Add
        </Button>
      </div>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="left">Descriptions</TableCell>
            <TableCell align="left">URL</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map((resource) => (
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
