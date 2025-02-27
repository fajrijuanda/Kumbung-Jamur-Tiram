'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useForm, Controller } from 'react-hook-form';
import CustomTextField from '@core/components/mui/TextField';
import { useTheme } from '@mui/material/styles';

const UpdateSensorDrawer = ({ open, handleClose, sensorData, setData }) => {
  const theme = useTheme();

  const customSelectStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: theme.palette.mode === 'dark' ? '#1E1E2D' : '#FFF',
      borderColor: theme.palette.mode === 'dark' ? '#6C757D' : '#CCC',
      color: theme.palette.mode === 'dark' ? '#FFF' : '#000'
    })
  };

  const [kumbungs, setKumbungs] = useState([]);
  const [selectedKumbung, setSelectedKumbung] = useState(null);

  useEffect(() => {
    fetch('/api/kumbung')
      .then(res => res.json())
      .then(data => {
        const kumbungOptions = data.map(k => ({ value: k.id, label: k.name }));
        setKumbungs(kumbungOptions);

        if (sensorData?.kumbungId) {
          const foundKumbung = kumbungOptions.find(k => k.value === sensorData.kumbungId);
          setSelectedKumbung(foundKumbung || null);
        }
      })
      .catch(error => console.error('❌ Error Fetching Kumbung:', error));
  }, [sensorData]);

  const { control, reset, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (sensorData) {
      console.log('🔹 Data Sensor yang diterima:', sensorData);

      reset({
        name: sensorData.name || '',
        topic: sensorData.topic || '',
        unit: sensorData.unit || '',
        description: sensorData.description || ''
      });
    }
  }, [sensorData, reset]);

  const onSubmit = async data => {
    console.log('🟢 Data yang akan dikirim:', {
      id: sensorData.id,
      name: data.name,
      topic: data.topic,
      unit: data.unit,
      description: data.description,
      kumbungId: selectedKumbung ? selectedKumbung.value : sensorData.kumbungId
    });

    const updatedSensor = {
      name: data.name,
      topic: data.topic,
      unit: data.unit,
      description: data.description,
      kumbungId: selectedKumbung ? selectedKumbung.value : sensorData.kumbungId
    };

    try {
      const response = await fetch(`/api/sensor-list/${sensorData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSensor),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Debug response
        console.error("❌ Error Update:", errorText);
        throw new Error(`Gagal memperbarui sensor. Server mengembalikan: ${errorText}`);
      }

      const result = await response.json(); // ✅ Simpan response JSON dalam variabel

      setData(prevData => prevData.map(sensor => (sensor.id === result.id ? result : sensor)));

      Swal.fire({ title: "Success!", text: "Sensor berhasil diperbarui!", icon: "success", confirmButtonText: "OK" });

      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error("❌ Error Update:", error);
      Swal.fire({ title: "Error!", text: error.message, icon: "error", confirmButtonText: "OK" });
    }
  };


  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 450, md: 500 } } }}
      onClose={handleClose}
    >
      <div className='flex items-center justify-between p-5'>
        <Typography variant='h5'>Update Sensor</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => <CustomTextField {...field} fullWidth label='Sensor Name' />}
        />
        <Controller
          name='topic'
          control={control}
          render={({ field }) => <CustomTextField {...field} fullWidth label='MQTT Topic' />}
        />
        <Controller
          name='unit'
          control={control}
          render={({ field }) => <CustomTextField {...field} fullWidth label='Unit' />}
        />
        <Controller
          name='description'
          control={control}
          render={({ field }) => <CustomTextField {...field} fullWidth label='Description' />}
        />

        <Select
          styles={customSelectStyles}
          options={kumbungs}
          value={selectedKumbung}
          onChange={setSelectedKumbung}
          placeholder='Pilih Kumbung'
        />
        <Button variant='contained' type='submit'>
          Update
        </Button>
      </form>
    </Drawer>
  );
};

export default UpdateSensorDrawer;
