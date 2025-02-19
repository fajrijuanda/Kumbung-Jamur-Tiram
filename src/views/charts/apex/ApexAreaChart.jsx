'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// Import komponen chart secara dinamis
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const ApexAreaChart = ({ sensorName, sensorTopic, chartColor, chartMin, chartMax }) => {
  const theme = useTheme()

  // Vars
  const infoColor = theme.palette[chartColor].main

  const divider = 'var(--mui-palette-divider)'
  const textDisabled = 'var(--mui-palette-text-disabled)'

  // State untuk menyimpan data chart dan nilai temperatur terbaru
  const [chartSeries, setChartSeries] = useState([{ name: '', data: [] }])
  const [chartCategories, setChartCategories] = useState([])
  const [currentTime, setCurrentTime] = useState('')
  const [currentValue, setCurrentValue] = useState(null)
  const [currentUnit, setCurrentUnit] = useState(null)

  // Ambil data dari API endpoint setiap 500ms
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Gunakan prop sensorName secara dinamis
        const res = await fetch(`/api/sensors?topic=${sensorTopic}`)
        const result = await res.json()
        let dataList = result.dataList

        // Extract nilai dan waktu dari dataList
        let testValue = dataList.map(item => item.value)
        let testDate = dataList.map(item => item.createdAt)

        // Set data untuk chart
        setChartSeries([{ name: sensorName, data: testValue }])
        setChartCategories(testDate)

        // Set waktu dan nilai sensor terbaru
        setCurrentTime(`${result.latest.date} ${result.latest.time}`)
        setCurrentValue(result.latest.value)
        setCurrentUnit(result.sensor.unit)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [sensorTopic])

  // Konfigurasi opsi chart dengan gradasi warna terbalik
  // Konfigurasi opsi chart dengan warna tema "Info"
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      animations: { enabled: false } // Non-aktifkan animasi
    },
    tooltip: { shared: false },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      curve: 'smooth', // Garis lebih halus
      width: 2,
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      labels: { colors: 'var(--mui-palette-text-secondary)' },
      fontSize: '13px',
      markers: {
        offsetY: 2,
        offsetX: theme.direction === 'rtl' ? 7 : -4
      },
      itemMargin: { horizontal: 9 }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: infoColor
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0,
        opacityFrom: 1,
        shadeIntensity: 1,
        stops: [0, 100],
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: infoColor
            },
            {
              opacity: 0,
              offset: 100,
              color: 'var(--mui-palette-background-paper)'
            }
          ]
        ]
      }
    },
    grid: {
      show: true,
      borderColor: divider,
      xaxis: {
        lines: { show: true }
      }
    },
    yaxis: {
      min: chartMin,
      max: chartMax,
      tickAmount: 5,
      labels: {
        style: { colors: textDisabled, fontSize: '13px' }
      },
      title: {
        text: `${sensorName} ${currentUnit}`,
        style: { color: textDisabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: divider },
      crosshairs: {
        stroke: { color: divider }
      },
      labels: {
        style: { colors: textDisabled, fontSize: '13px' }
      },
      categories: chartCategories
    }
  };


  return (
    <Card>
      <CardHeader
        title={sensorName}
        subheader='Data diperbarui setiap 500ms'
        action={
          <Box sx={{ textAlign: 'right', ml: 'auto' }}>
            <Typography variant='body2'>{currentTime}</Typography>
            {currentValue !== null && (
              <Typography variant='h5' sx={{ mt: 0.5 }}>
                {currentValue} {currentUnit}
              </Typography>
            )}
          </Box>
        }
        sx={{
          flexDirection: 'row', // gunakan row agar selalu horizontal
          alignItems: 'center',
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: 0 }
        }}
      />
      <CardContent>
        <AppReactApexCharts
          type='area'
          width='100%'
          height={400}
          options={options}
          series={chartSeries}
        />
      </CardContent>
    </Card>
  )
}

export default ApexAreaChart
