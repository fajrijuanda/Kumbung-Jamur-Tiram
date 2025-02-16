'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Import komponen chart secara dinamis
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'), { ssr: false })

const ApexTemperatureChart = () => {
  const theme = useTheme()

  const divider = 'var(--mui-palette-divider)'
  const textDisabled = 'var(--mui-palette-text-disabled)'

  // State untuk menyimpan data suhu dan kategori (waktu)
  const [chartSeries, setChartSeries] = useState([{ name: 'Suhu', data: [] }])
  const [chartCategories, setChartCategories] = useState([])
  const [currentTime, setCurrentTime] = useState('')

  // Ambil data dari API endpoint setiap 500ms
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/sensors?name=sensor/suhu_udara')
        const result = await res.json()
        let dataList = result.dataList

        // Extract
        let testValue = dataList.map(item => item.value)
        let testDate = dataList.map(item => item.createdAt)

        // Set Data
        setChartSeries(prevSeries => {
          return [{ name: 'Suhu', data: testValue }]
        })

        setChartCategories(prevCategories => {
          return testDate
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Konfigurasi opsi chart tanpa animasi
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      animations: { enabled: false } // non-aktifkan animasi
    },
    tooltip: { shared: false },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      curve: 'straight'
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
    colors: ['#e53935'], // Warna garis chart
    fill: {
      opacity: 0.5,
      type: 'solid'
    },
    grid: {
      show: true,
      borderColor: divider,
      xaxis: {
        lines: { show: true }
      }
    },
    yaxis: {
      labels: {
        style: { colors: textDisabled, fontSize: '13px' }
      },
      title: {
        text: 'Suhu (°C)',
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
  }

  return (
    <Card>
      <CardHeader
        title='Simulasi Suhu'
        subheader='Data diperbarui setiap 500ms'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        <AppReactApexCharts type='area' width='100%' height={400} options={options} series={chartSeries} />
        <Typography variant='body2' sx={{ mt: 2, textAlign: 'center' }}>
          Waktu sekarang: {currentTime}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default ApexTemperatureChart
