import React from 'react';
import AppContainer from './AppContainer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import Tabs from '@material-ui/core/Tabs';
import Container from '@material-ui/core/Container';
import Tab from '@material-ui/core/Tab';
import Skeleton from '@material-ui/lab/Skeleton';
import Box from '@material-ui/core/Box';
import ProjectDetails from './ProjectDetails';
import DailyReports from './DailyReports';
import ProjectBlockers from './ProjectBlockers';
import EditProjectForm from './EditProjectForm';
import { UserContext } from '../context/GlobalState';
import ProjectDocuments from './ProjectDocuments';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: '#c7a936',
      opacity: 1,
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

const SingleProject = () => {
  const [value, setValue] = React.useState(0);
  const {state} = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false);
  const {id} = useParams();

  const handleChange = (e, newValue) => {
    setValue(newValue);
  }

  return (
    <AppContainer>
      <Container>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"  
        >
          <AntTab label="Details" {...a11yProps(0)} />
          <AntTab label="Documents" {...a11yProps(1)} />
          <AntTab label="Blockers" {...a11yProps(2)} />
          {state.user?.roles[0].name !== 'developer' && (
            <AntTab label="Edit Project" {...a11yProps(3)} />
          )}
        </Tabs>
        <div>
          {loading ? (
            <Skeleton variant="rect" width="100%">
              <div style={{ paddingTop: '57%' }} />
            </Skeleton>
          ) : (
            <>
              <TabPanel value={value} index={0}>
                  <ProjectDetails id={id} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                  <ProjectDocuments id={id} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                  <ProjectBlockers id={id} />
              </TabPanel>
              {state.user?.roles[0].name !== 'developer' && (
                <TabPanel value={value} index={3}>
                  <EditProjectForm id={id} />
                </TabPanel>
              )}
            </>
          )}
        </div>
      </Container>
    </AppContainer>
  )
}

export default SingleProject;
