import Grid from '@mui/material/Grid';
import SensorListTable from './SensorListTable';

const SensorListPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SensorListTable />
      </Grid>
    </Grid>
  );
};

export default SensorListPage;
