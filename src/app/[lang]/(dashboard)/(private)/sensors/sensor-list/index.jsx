// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import UserListTable from './SensorListTable'

const UserList = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default UserList
