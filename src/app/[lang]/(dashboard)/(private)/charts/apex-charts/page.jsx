// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import ApexBarChart from '@views/charts/apex/ApexBarChart'

import ApexLineChart from '@views/charts/apex/ApexLineChart'
import ApexAreaChart from '@views/charts/apex/ApexAreaChart'
import ApexRadarChart from '@views/charts/apex/ApexRadarChart'
import ApexDonutChart from '@views/charts/apex/ApexDonutChart'
import ApexColumnChart from '@views/charts/apex/ApexColumnChart'
import ApexScatterChart from '@views/charts/apex/ApexScatterChart'
import ApexHeatmapChart from '@views/charts/apex/ApexHeatmapChart'
import ApexRadialBarChart from '@views/charts/apex/ApexRadialBarChart'
import ApexCandlestickChart from '@views/charts/apex/ApexCandlestickChart'

const ApexCharts = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h4'>Stream</Typography>
        {/* <Typography>
          <code>react-apexcharts</code> is a third-party library. Please refer to its{' '}
          <Link
            href='https://apexcharts.com'
            target='_blank'
            rel='noopener noreferrer'
            className='no-underline text-primary'
          >
            official documentation
          </Link>{' '}
          for more details.
        </Typography> */}
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'Suhu Udara'} sensorTopic={'sensor/suhu_udara'} chartColor='warning' chartMin={0} chartMax={100} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'Suhu Media'} sensorTopic={'sensor/suhu_media'} chartColor='error' chartMin={0} chartMax={100}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'Kelembaban Udara'} sensorTopic={'sensor/kelembaban_udara'} chartColor='info' chartMin={0} chartMax={100}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'Kelembaban Media'} sensorTopic={'sensor/kelembaban_media'} chartColor='primary' chartMin={0} chartMax={100}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'O2'} sensorTopic={'sensor/O2'} chartColor='success' chartMin={0} chartMax={100}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'CO2'} sensorTopic={'sensor/CO2'} chartColor='secondary' chartMin={0} chartMax={10000}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'UV'} sensorTopic={'sensor/UV'} chartColor='primary' chartMin={0} chartMax={11}/>
      </Grid>
      <Grid item xs={12} md={6}>
        <ApexAreaChart sensorName={'pH'} sensorTopic={'sensor/pH'} chartColor='info' chartMin={0} chartMax={10}/>
      </Grid>
    </Grid>
  )
}

export default ApexCharts
