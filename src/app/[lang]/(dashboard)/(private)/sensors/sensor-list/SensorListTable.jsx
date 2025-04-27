'use client'

import { useEffect, useState, useMemo } from 'react'
import Swal from 'sweetalert2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import { createColumnHelper, useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table'
import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@components/TablePaginationComponent'
import AddSensorDrawer from './AddSensorDrawer'
import UpdateSensorDrawer from './UpdateSensorDrawer'

const Icon = styled('i')({})

const SensorListTable = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [addSensorOpen, setAddSensorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [updateSensorOpen, setUpdateSensorOpen] = useState(false)
  const [selectedSensor, setSelectedSensor] = useState(null)

  const handleEdit = sensor => {
    setSelectedSensor(sensor)
    setUpdateSensorOpen(true)
  }

  useEffect(() => {
    fetchSensors()
  }, [])

  // 🔥 Gunakan useEffect untuk update tampilan setelah data berubah
  useEffect(() => {
    setFilteredData(data)
  }, [data])

  const fetchSensors = async () => {
    try {
      const res = await fetch('/api/sensor-list')
      if (!res.ok) throw new Error('Failed to fetch sensors')
      const sensors = await res.json()

      setData(sensors) // 🔥 Perbarui data sensor di state utama
      setFilteredData(sensors) // 🔥 Pastikan filteredData juga diperbarui
    } catch (error) {
      console.error('Error fetching sensors:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSensor = async id => {
    Swal.fire({
      title: 'Apa kamu yakin?',
      text: 'Anda tidak akan dapat mengembalikan ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus itu!'
    }).then(async result => {
      if (result.isConfirmed) {
        try {
          const res = await fetch('/api/sensor-list', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
          })

          if (!res.ok) {
            throw new Error('Failed to delete sensor')
          }

          const response = await res.json() // Ambil response dari API

          // 🔥 **Pastikan API benar-benar menghapus sensor sebelum update state**
          console.log('🔥 API Response after delete:', response)

          // 🔥 **Ambil ulang data sensor setelah delete**
          await fetchSensors()

          // 🔥 **Hanya update state jika masih ada sensor**
          setData(prevData => (prevData.length > 1 ? prevData.filter(sensor => sensor.id !== id) : []))

          Swal.fire('Deleted!', 'The sensor has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting sensor:', error)
          Swal.fire('Error!', 'Failed to delete sensor.', 'error')
        }
      }
    })
  }

  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'ID',
        cell: ({ row }) => row.index + 1 // Nomor urut otomatis
      },
      columnHelper.accessor('name', { header: 'Sensor Name' }),
      columnHelper.accessor('topic', { header: 'Topic' }),
      columnHelper.accessor('unit', { header: 'Unit' }),
      columnHelper.accessor('description', { header: 'Description' }),
      // columnHelper.accessor('location', { header: 'location' }),
      {
        id: 'action',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <IconButton onClick={() => handleEdit(row.original)}>
              <i className='tabler-edit text-blue-500' />
            </IconButton>
            <IconButton onClick={() => deleteSensor(row.original.id)}>
              <i className='tabler-trash text-red-500' />
            </IconButton>
          </div>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: rowsPerPage // Gunakan rowsPerPage untuk pagination default
      }
    }
  })

  if (loading) return <p>Loading...</p>
  if (!data.length) return <p>No sensors available.</p>

  return (
    <Card>
      <CardHeader title='Sensor List' />
      <div className='overflow-x-auto'>
        {/* Bagian Filter dan Tombol */}
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <div className='flex flex-row items-center gap-4'>
            <Select
              value={rowsPerPage}
              onChange={e => setRowsPerPage(parseInt(e.target.value, 10))}
              variant='outlined'
              size='small'
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <TextField
              variant='outlined'
              size='small'
              placeholder='Search Sensor'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='max-sm:is-full'
            />
          </div>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddSensorOpen(true)} // ✅
            >
              Add New Sensor
            </Button>
          </div>
        </div>

        {/* Tabel Data */}
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>{header.column.columnDef.header}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{cell.column.columnDef.cell(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
      <AddSensorDrawer
        open={addSensorOpen}
        handleClose={() => setAddSensorOpen(false)}
        setData={setData}
        sensorData={data}
      />
      <UpdateSensorDrawer
        open={updateSensorOpen}
        handleClose={() => setUpdateSensorOpen(false)}
        sensorData={selectedSensor}
        fetchSensors={fetchSensors}
      />
    </Card>
  )
}

export default SensorListTable
