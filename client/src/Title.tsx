import * as React from 'react';
import Typography from '@material-ui/core/Typography';

export const Title: React.FunctionComponent = (props) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}
