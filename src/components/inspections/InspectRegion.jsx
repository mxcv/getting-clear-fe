import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, Grid, Paper, CircularProgress, Box,
  TableSortLabel, TablePagination
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';

const InspectRegion = () => {
  const [regions, setRegions] = useState([]);
  const [regionId, setRegionId] = useState('');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('');

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    axios.get('/regions')
      .then(response => setRegions(response.data))
      .catch(err => setError('Failed to fetch regions.'));
  }, []);

  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
  };

  const handleDateChange = (date, setter) => {
    setter(date);
  };

  const fetchData = async () => {
    if (!regionId || !from || !to) {
      setError('Please select region and valid date range.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/inspections/regions/${regionId}`, {
        params: { from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') },
      });
      setData(response.data.data);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(column);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getRowColor = (total) => {
    const ratio = total / 40;
    let red, green;

    if (ratio <= 0.5) {
      red = Math.round(510 * ratio);
      green = 255;
    } else {
      red = 255;
      green = Math.round(510 * (1 - ratio));
    }

    return `rgba(${red}, ${green}, 0, 0.3)`;
  };

  return (
    <Box padding={3}>
      <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
        <Typography variant="h4" gutterBottom>
          Аналіз областей
        </Typography>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Область</InputLabel>
            <Select
              value={regionId}
              onChange={handleRegionChange}
              label="Область"
              sx={{ minWidth: 300 }}
            >
              {regions.map(region => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container item spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Від"
                value={from}
                onChange={(date) => handleDateChange(date, setFrom)}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="До"
                value={to}
                sx={ { ml: {md: 3} }}
                onChange={(date) => handleDateChange(date, setTo)}
                renderInput={(props) => <TextField {...props} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchData}
            disabled={loading || !regionId || !from || !to}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Завантажити'}
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      {data.length > 0 && (
        <TableContainer component={Paper} mt={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'id'}
                    direction={sortBy === 'id' ? sortOrder : 'asc'}
                    onClick={() => handleSort('id')}
                  >
                    Назва
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'items'}
                    direction={sortBy === 'items' ? sortOrder : 'asc'}
                    onClick={() => handleSort('items')}
                  >
                    Товари
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'locality'}
                    direction={sortBy === 'locality' ? sortOrder : 'asc'}
                    onClick={() => handleSort('locality')}
                  >
                    Місто
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'suppliers'}
                    direction={sortBy === 'suppliers' ? sortOrder : 'asc'}
                    onClick={() => handleSort('suppliers')}
                  >
                    Постачальники
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'total'}
                    direction={sortBy === 'total' ? sortOrder : 'asc'}
                    onClick={() => handleSort('total')}
                  >
                    Всього
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} sx={{ backgroundColor: getRowColor(row.total) }}>
                  <TableCell>
                    <a href={`/inspections/tenders/${row.id}`} target="_blank" rel="noopener noreferrer">
                      {row.title ? (row.title.length > 50 ? (row.title.substring(0, 70) + '...') : row.title) : row.id}
                    </a>
                  </TableCell>
                  <TableCell>{row.items}</TableCell>
                  <TableCell>{row.locality}</TableCell>
                  <TableCell>{row.suppliers}</TableCell>
                  <TableCell>{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default InspectRegion;
