import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Skeleton from '@material-ui/lab/Skeleton';
import AppContainer from './AppContainer';
import { axios, BASE_URL } from '../utils/utils';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

const Resources = () => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [resources, setResources] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${BASE_URL}/api/resources`)
    .then(res => {
      console.log(res.data);
      setResources(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.statusText === "Unauthorized") {
          location.replace('/login');
      }
      setLoading(false);
    });
  }, []);

  const handleClick = id => {
    location.replace(`/dashboard/resources/${id}`)
  }

  return (
    <AppContainer>
      <CssBaseline />
      <Container>
        <Grid container spacing={5}>
          {loading ? Array.from(new Array(3)).map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
                <Skeleton variant="rect" width="100%" height={218} />
                <br />
                <br />
                <Skeleton />
                <Skeleton />
            </Grid>
          )) : resources.map(resource => (
                <Grid item xs={12} sm={4} key={resource.id}>
                  <Card>
                    <CardActionArea onClick={() => handleClick(resource.id)}>
                      <CardMedia
                        component="img"
                        alt={resource.title}
                        height="220"
                        src="/storage/images/folder_icon.png"
                        title={resource.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {resource.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        {resource.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button size="small" color="primary" onClick={() => handleClick(resource.id)}>
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
          }
        </Grid>
      </Container>
    </AppContainer>
  )
}

export default Resources;
