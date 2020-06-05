import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import { Chart } from './Chart';
import { TextField, Button } from '@material-ui/core';
import { buildVoters, election, Voter } from 'bottom-up-election-lib';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

let voters: Voter[] = []

export default function Dashboard() {
  const [populationSize, setPopulationSize] = React.useState('1000');
  const [groupSize, setGroupSize] = React.useState('10');
  const [winners, setWinners] = React.useState<Voter[]>([]);

  const validPopluationSize = Number(populationSize) > 2;
  const validGroupSize = Number(groupSize) > 2;

  const runSimulation = () => {
    voters = buildVoters(Number(populationSize), 100, 15);
    setWinners(election(voters, Number(groupSize)));
  }

  // Run sim on mount
  React.useEffect(runSimulation, []);

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Bottom Up Election Simulator
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Controls */}
            <Grid item xs={12} md={8} lg={9}>
              <Grid container spacing={3}>
                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      label="Population Size"
                      type="number"
                      value={populationSize}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPopulationSize(event.target.value)}
                      error={!validPopluationSize}
                      helperText={!validPopluationSize && 'Population size must be greater than 2'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={3}>
                    <TextField
                      label="Group Size"
                      type="number"
                      value={groupSize}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setGroupSize(event.target.value)}
                      error={!validGroupSize}
                      helperText={!validGroupSize && 'Group size must be greater than 2'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4} lg={3}>
                    <Button onClick={runSimulation} disabled={!validPopluationSize || !validGroupSize} variant="outlined">Run Simulation</Button>
                  </Grid>
              </Grid>
            </Grid>
            {/* Charts */}
            {/* <Grid item xs={12}>
              <Paper className={fixedHeightPaper} style={{ height: '340px'}}>
                <Chart voters={voters} label="Voters" />
              </Paper>
            </Grid> */}
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper} style={{ height: '340px'}}>
                <Chart voters={winners} label="Winners" />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}