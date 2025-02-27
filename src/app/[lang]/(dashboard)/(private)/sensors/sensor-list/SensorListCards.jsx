'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

const UserListCards = () => {
  const [stats, setStats] = useState({ totalSensors: 0, activeSensors: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSensorStats()

    // 🔥 Ambil data setiap 5 detik untuk real-time update
    const interval = setInterval(fetchSensorStats, 5000)

    return () => clearInterval(interval) // Bersihkan interval saat komponen di-unmount
  }, [])

  const fetchSensorStats = async () => {
    try {
      console.log('🔄 Fetching sensor stats...')
      const res = await fetch('/api/sensor-stats')

      if (!res.ok) throw new Error(`Failed to fetch sensor stats: ${res.status}`)

      const data = await res.json()

      console.log('📊 Data dari API:', data)

      setStats({
        totalSensors: data.totalSensors || 0, // Dari database
        activeSensors: data.activeSensors || 0 // Dari tabel `Data`
      })
    } catch (error) {
      console.error('❌ Error fetching sensor stats:', error)
      setStats({ totalSensors: 0, activeSensors: 0 }) // Set default jika API gagal
    } finally {
      setLoading(false)
    }
  }

  const data = [
    {
      title: 'Total Sensor',
      stats: loading ? 'Loading...' : stats.totalSensors,
      avatarIcon: 'tabler-database',
      avatarColor: 'primary',
      trend: 'neutral',
      subtitle: 'Jumlah Sensor Terdaftar di Database'
    },
    {
      title: 'Sensor Aktif',
      stats: loading ? 'Loading...' : stats.activeSensors,
      avatarIcon: 'tabler-device-analytics',
      avatarColor: 'success',
      trend: 'neutral',
      subtitle: 'Sensor dengan Data dalam 5 Menit Terakhir'
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
