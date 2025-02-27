import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  TextField as MuiTextField
} from '@mui/material';

const EstimateItem = () => {
  const [year, setYear] = useState('');
  const [classificationId, setClassificationId] = useState('');
  const [classificationDescription, setClassificationDescription] = useState('');
  const [classifications, setClassifications] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const response = await axios.get('/items/classifications');
        setClassifications(response.data);
      } catch (err) {
        setError('Помилка завантаження.');
      }
    };

    fetchClassifications();
  }, []);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleClassificationChange = (event, newValue) => {
    if (newValue) {
      setClassificationDescription(newValue.description);
      setClassificationId(newValue.id);
    } else {
      setClassificationDescription('');
      setClassificationId('');
    }
  };

  const handleSubmit = async () => {
    if (!year || !classificationId) {
      setError('Введіть рік і класифікацію.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/estimates/items', {
        params: {
          year: year,
          classificationId: classificationId
        }
      });
      setData(response.data);
    } catch (err) {
      setError('Помилка завантаження.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Середні ціни на товари
        </Typography>
      </Grid>

      <Grid container item xs={12} spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={4} md={2}>
          <TextField
            label="Рік"
            type="number"
            value={year}
            onChange={handleYearChange}
            variant="outlined"
            fullWidth
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={8} md={6}>
          <Autocomplete
            value={classifications.find((classification) => classification.id === classificationId) || null}
            onChange={handleClassificationChange}
            inputValue={classificationDescription}
            onInputChange={(event, newInputValue) => setClassificationDescription(newInputValue)}
            options={classifications}
            getOptionLabel={(option) => `${option.id}: ${option.description}`}
            renderInput={(params) => (
              <MuiTextField
                {...params}
                label="Класифікація"
                variant="outlined"
                fullWidth
                disabled={loading}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterOptions={(options, state) => {
              return options.filter(option =>
                option.description.toLowerCase().includes(state.inputValue.toLowerCase())
              );
            }}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Завантажити"}
        </Button>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}

      {data.length > 0 && (
        <Grid item xs={12} style={{ width: '100%' }}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Середня ціна</TableCell>
                  <TableCell>Кількість</TableCell>
                  <TableCell>ID одиниці виміру</TableCell>
                  <TableCell>Одиниця виміру</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.averagePrice.toFixed(2)}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{item.unit.id}</TableCell>
                    <TableCell>{item.unit.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default EstimateItem;
