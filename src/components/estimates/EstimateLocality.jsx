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
  TableSortLabel,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

const EstimateLocality = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [year, setYear] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('realExpectedRatio');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get('/regions');
        setRegions(response.data);
      } catch (err) {
        setError('Failed to load regions');
      }
    };
    fetchRegions();
  }, []);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedRegion || !year) {
      setError('Необхідно вказати область і рік.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/estimates/localities', {
        params: {
          regionId: selectedRegion,
          year: year
        }
      });
      const data = response.data.map(i => ({
        ...i,
        realExpectedRatio: i.expectedExpenditures ? i.realExpenditures / i.expectedExpenditures  : 0, 
        realDefenseRatio: i.realExpenditures ? +i.defenseExpenditures / +i.realExpenditures : 0,
      }));
      setData(data);
    } catch (err) {
      setError('Помилка завантаження.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    if (!data || !data.length) return [];
    
    const comparator = (a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    };
    
    return data.slice().sort(comparator);
  }, [data, order, orderBy]);

  const getRowColor = (ratio) => {
    if (ratio <= 1) {
      return 'rgba(0, 255, 0, 0.3)'; // Зелений
    } else if (ratio <= 2) {
      const yellowRatio = (ratio - 1) / 1;
      return `rgba(255, ${255 - Math.round(255 * yellowRatio)}, 0, 0.3)`; // Перехід від жовтого до червоного
    } else {
      return 'rgba(255, 0, 0, 0.3)'; // Червоний
    }
  };

  return (
    <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Статиска міст
        </Typography>
      </Grid>

      <Grid item xs={12} md={4} spacing={3}>
        <TextField
          sx={{ mb: 4 }}
          label="Рік"
          type="number"
          value={year}
          onChange={handleYearChange}
          variant="outlined"
          fullWidth
          disabled={loading}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Region</InputLabel>
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            label="Область"
            disabled={loading}
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
                  <TableCell sortDirection={orderBy === 'tenderCount' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'tenderCount'}
                      direction={orderBy === 'tenderCount' ? order : 'asc'}
                      onClick={() => handleRequestSort('tenderCount')}
                    >
                      Кількість тендерів
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'realExpenditures' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'realExpenditures'}
                      direction={orderBy === 'realExpenditures' ? order : 'asc'}
                      onClick={() => handleRequestSort('realExpenditures')}
                    >
                      Реальні витрати
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'expectedExpenditures' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'expectedExpenditures'}
                      direction={orderBy === 'expectedExpenditures' ? order : 'asc'}
                      onClick={() => handleRequestSort('expectedExpenditures')}
                    >
                      Оічкувані витрати
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'read' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'realExpectedRatio'}
                      direction={orderBy === 'realExpectedRatio' ? order : 'asc'}
                      onClick={() => handleRequestSort('realExpectedRatio')}
                    >
                      Співвідношення реальних і оічкуваних витрат
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'defenseExpenditures' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'defenseExpenditures'}
                      direction={orderBy === 'defenseExpenditures' ? order : 'asc'}
                      onClick={() => handleRequestSort('defenseExpenditures')}
                    >
                      Витрати на оборону
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'realDefenseRatio' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'realDefenseRatio'}
                      direction={orderBy === 'realDefenseRatio' ? order : 'asc'}
                      onClick={() => handleRequestSort('realDefenseRatio')}
                    >
                      Співвідношення витрат на оборону
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'locality.name' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'locality.name'}
                      direction={orderBy === 'locality.name' ? order : 'asc'}
                      onClick={() => handleRequestSort('locality.name')}
                    >
                      Місто
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow key={item.id} style={{ backgroundColor: getRowColor(item.realExpectedRatio) }}>
                    <TableCell>{item.tenderCount}</TableCell>
                    <TableCell>{parseFloat(item.realExpenditures).toLocaleString()}</TableCell>
                    <TableCell>{parseFloat(item.expectedExpenditures).toLocaleString()}</TableCell>
                    <TableCell>{parseFloat(item.realExpectedRatio).toFixed(2)}</TableCell>
                    <TableCell>{parseFloat(item.defenseExpenditures).toLocaleString()}</TableCell>
                    <TableCell>{parseFloat(item.realDefenseRatio).toLocaleString()}</TableCell>
                    <TableCell>{item.locality.name}</TableCell>
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

export default EstimateLocality;
