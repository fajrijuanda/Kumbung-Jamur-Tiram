'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

const UserListCards = () => {
  const [stats, setStats] = useState({ totalSensors: 0, activeSensors: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const eventSource = new EventSource('/api/sensor-stats') // Gunakan API utama

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setStats({
        totalSensors: data.totalSensors,
        activeSensors: data.activeSensors
      })
      setLoading(false)
    }

    eventSource.onerror = (error) => {
      console.error('❌ SSE Error:', error)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const data = [
    {
      title: 'Total Sensor',
      stats: loading ? 'Loading...' : stats.totalSensors,
      avatarIcon: 'tabler-database',
      avatarColor: 'primary',
      trend: null,
      subtitle: 'Jumlah Sensor Terdaftar di Database'
    },
    {
      title: 'Sensor Aktif',
      stats: loading ? 'Loading...' : stats.activeSensors,
      avatarIcon: 'tabler-device-analytics',
      avatarColor: 'success',
      trend: null,
      subtitle: 'Sensor dengan Data dalam 1 Menit Terakhir'
    }
  ]

  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} item xs={12} sm={6} md={6}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards
