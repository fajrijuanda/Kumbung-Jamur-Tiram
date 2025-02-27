'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { useTheme } from '@mui/material/styles'

// API Endpoint
const API_BASE = 'https://ibnux.github.io/data-indonesia/'

const AddSensorDrawer = ({ open, handleClose, setData }) => {
  const theme = useTheme() // 🔥 Dapatkan tema saat ini (Light/Dark Mode)

  // **Gunakan warna berdasarkan tema**
  const customSelectStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: theme.palette.mode === 'dark' ? '#1E1E2D' : '#FFF',
      borderColor: theme.palette.mode === 'dark' ? '#6C757D' : '#CCC',
      color: theme.palette.mode === 'dark' ? '#FFF' : '#000'
    }),
    singleValue: styles => ({
      ...styles,
      color: theme.palette.mode === 'dark' ? '#FFF' : '#000'
    }),
    menu: styles => ({
      ...styles,
      backgroundColor: theme.palette.mode === 'dark' ? '#1E1E2D' : '#FFF'
    }),
    option: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isFocused
        ? theme.palette.mode === 'dark'
          ? '#6C757D'
          : '#EAEAEA'
        : theme.palette.mode === 'dark'
          ? '#1E1E2D'
          : '#FFF',
      color: theme.palette.mode === 'dark' ? '#FFF' : '#000'
    })
  }
  // State untuk lokasi
  const [provinces, setProvinces] = useState([])
  const [kabupaten, setKabupaten] = useState([])
  const [kecamatan, setKecamatan] = useState([])
  const [kelurahan, setKelurahan] = useState([])
  const [kumbungs, setKumbungs] = useState([])

  const [selectedProvinsi, setSelectedProvinsi] = useState(null)
  const [selectedKabupaten, setSelectedKabupaten] = useState(null)
  const [selectedKecamatan, setSelectedKecamatan] = useState(null)
  const [selectedKelurahan, setSelectedKelurahan] = useState(null)
  const [selectedKumbung, setSelectedKumbung] = useState(null)
  const [alamatDetail, setAlamatDetail] = useState('')

  // Fetch Data Provinsi
  useEffect(() => {
    fetch(`${API_BASE}provinsi.json`)
      .then(res => res.json())
      .then(data => setProvinces(data.map(p => ({ value: p.id, label: p.nama }))))
  }, [])

  // Fetch Data Kumbung dari Database
  useEffect(() => {
    fetch('/api/kumbung')
      .then(res => res.json())
      .then(data => setKumbungs(data.map(k => ({ value: k.id, label: k.name }))))
  }, [])

  // Fetch Data Kabupaten Berdasarkan Provinsi
  useEffect(() => {
    if (selectedProvinsi) {
      fetch(`${API_BASE}kabupaten/${selectedProvinsi.value}.json`)
        .then(res => res.json())
        .then(data => setKabupaten(data.map(k => ({ value: k.id, label: k.nama }))))
    }
  }, [selectedProvinsi])

  // Fetch Data Kecamatan Berdasarkan Kabupaten
  useEffect(() => {
    if (selectedKabupaten) {
      fetch(`${API_BASE}kecamatan/${selectedKabupaten.value}.json`)
        .then(res => res.json())
        .then(data => setKecamatan(data.map(kec => ({ value: kec.id, label: kec.nama }))))
    }
  }, [selectedKabupaten])

  // Fetch Data Kelurahan Berdasarkan Kecamatan
  useEffect(() => {
    if (selectedKecamatan) {
      fetch(`${API_BASE}kelurahan/${selectedKecamatan.value}.json`)
        .then(res => res.json())
        .then(data => setKelurahan(data.map(kel => ({ value: kel.id, label: kel.nama }))))
    }
  }, [selectedKecamatan])

  // Form Handling
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      topic: '',
      unit: '',
      description: ''
    }
  })

  const onSubmit = async data => {
    if (
      !selectedKumbung ||
      !selectedProvinsi ||
      !selectedKabupaten ||
      !selectedKecamatan ||
      !selectedKelurahan ||
      !alamatDetail
    ) {
      Swal.fire({
        title: 'Error!',
        text: 'Harap lengkapi semua informasi lokasi.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }

    const location = `${alamatDetail}, ${selectedKelurahan.label}, ${selectedKecamatan.label}, ${selectedKabupaten.label}, ${selectedProvinsi.label}`

    const newSensor = {
      name: data.name,
      topic: data.topic,
      unit: data.unit,
      description: data.description,
      location,
      kumbungId: selectedKumbung.value
    }

    try {
      const response = await fetch('/api/sensor-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSensor)
      })

      if (!response.ok) throw new Error('Gagal menyimpan sensor.')

      const savedSensor = await response.json()
      setData(prevData => [...prevData, savedSensor])

      // 🔥 **Reset Form Setelah Submit**
      reset() // Reset semua input di form
      setSelectedProvinsi(null)
      setSelectedKabupaten(null)
      setSelectedKecamatan(null)
      setSelectedKelurahan(null)
      setSelectedKumbung(null)
      setAlamatDetail('')

      // 🔥 **SweetAlert Konfirmasi Sukses**
      Swal.fire({
        title: 'Success!',
        text: 'Sensor berhasil ditambahkan!',
        icon: 'success',
        confirmButtonText: 'OK'
      })

      // 🔥 **Tutup Drawer Secara Otomatis Setelah 1 Detik**
      setTimeout(() => {
        handleClose()
      }, 1000)
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Gagal menyimpan sensor.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 450, md: 500 } } }}
      onClose={handleClose}
    >
      <div className='flex items-center justify-between p-5'>
        <Typography variant='h5'>Add New Sensor</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
        <Controller
          name='name'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='Sensor Name'
              placeholder='Temperature Sensor'
              error={errors.name}
            />
          )}
        />
        <Controller
          name='topic'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CustomTextField
              {...field}
              fullWidth
              label='MQTT Topic'
              placeholder='sensor/temperature'
              error={errors.topic}
            />
          )}
        />
        <Controller
          name='unit'
          control={control}
          render={({ field }) => <CustomTextField {...field} fullWidth label='Unit' placeholder='°C, %, PPM, etc.' />}
        />
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <CustomTextField {...field} fullWidth label='Description' placeholder='Sensor for monitoring temperature' />
          )}
        />
        <Select
          styles={customSelectStyles}
          options={kumbungs}
          value={selectedKumbung}
          onChange={setSelectedKumbung}
          placeholder='Pilih Kumbung'
        />
        <Select
          styles={customSelectStyles}
          options={provinces}
          value={selectedProvinsi}
          onChange={setSelectedProvinsi}
          placeholder='Pilih Provinsi'
        />
        <Select
          styles={customSelectStyles}
          options={kabupaten}
          value={selectedKabupaten}
          onChange={setSelectedKabupaten}
          placeholder='Pilih Kabupaten'
          isDisabled={!selectedProvinsi}
        />
        <Select
          styles={customSelectStyles}
          options={kecamatan}
          value={selectedKecamatan}
          onChange={setSelectedKecamatan}
          placeholder='Pilih Kecamatan'
          isDisabled={!selectedKabupaten}
        />
        <Select
          styles={customSelectStyles}
          options={kelurahan}
          value={selectedKelurahan}
          onChange={setSelectedKelurahan}
          placeholder='Pilih Kelurahan'
          isDisabled={!selectedKecamatan}
        />
        <CustomTextField
          fullWidth
          label='Detail Alamat'
          placeholder='PT .....'
          value={alamatDetail}
          onChange={e => setAlamatDetail(e.target.value)}
        />

        <Button variant='contained' type='submit'>
          Submit
        </Button>
      </form>
    </Drawer>
  )
}

export default AddSensorDrawer
