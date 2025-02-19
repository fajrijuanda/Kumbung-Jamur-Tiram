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

const ApexTemperatureChart = () => {
  const theme = useTheme()

  const divider = 'var(--mui-palette-divider)'
  const textDisabled = 'var(--mui-palette-text-disabled)'

  // State untuk menyimpan data chart dan nilai temperatur terbaru
  const [chartSeries, setChartSeries] = useState([{ name: 'Suhu', data: [] }])
  const [chartCategories, setChartCategories] = useState([])
  const [currentTime, setCurrentTime] = useState('')
  const [currentTemp, setCurrentTemp] = useState(null)

  // Ambil data dari API endpoint setiap 500ms
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/sensors?name=sensor/suhu_udara')
        const result = await res.json()
        let dataList = result.dataList

        // Extract nilai dan waktu dari dataList
        let testValue = dataList.map(item => item.value)
        let testDate = dataList.map(item => item.createdAt)

        // Set data untuk chart
        setChartSeries([{ name: 'Suhu', data: testValue }])
        setChartCategories(testDate)

        // Set waktu dan temperatur terbaru
        setCurrentTime(`${result.latest.date} ${result.latest.time}`)
        setCurrentTemp(result.latest.value)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Konfigurasi opsi chart dengan gradasi warna terbalik
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
      width: 3,
      colors: ['#FF4C51'] // Warna garis merah
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
    colors: ['#FF9F43'], // Warna bawah (oranye)
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical', // Membuat gradasi dari bawah ke atas
        shadeIntensity: 1,
        gradientToColors: ['#FF4C51'], // Warna atas (merah)
        stops: [100, 50, 0] // Membalikkan gradasi
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
      min: 0, // Tetapkan minimum pada 0 °C
      max: 100, // Tetapkan maksimum pada 100 °C
      tickAmount: 5,
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
        action={
          <Box sx={{ textAlign: 'right', ml: 'auto' }}>
            <Typography variant='body2'>{currentTime}</Typography>
            {currentTemp !== null && (
              <Typography variant='h5' sx={{ mt: 0.5 }}>
                {currentTemp} °C
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

export default ApexTemperatureChart
