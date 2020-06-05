import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { ScatterChart, Scatter, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Title } from './Title';
import { Voter } from 'bottom-up-election-lib/src';

interface ChartProps {
  voters: Voter[];
  label: string;
}

export const Chart: React.FunctionComponent<ChartProps> = (props) => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>{props.label}</Title>
      <ResponsiveContainer>
        <ScatterChart
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <YAxis type="number" dataKey="votingAbilityIndex" name="VAI" stroke={theme.palette.text.secondary} domain={[0, 1]}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Voting Ability Index
            </Label>
          </YAxis>
          <XAxis type="number" dataKey="iq" name="IQ" stroke={theme.palette.text.secondary} domain={['dataMin - 1', 'dataMax + 1']} tickCount={10}>
            <Label
              position="center"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              IQ
            </Label>
          </XAxis>
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name={props.label} data={props.voters} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}