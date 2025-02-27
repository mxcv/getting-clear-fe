import React, { useState } from 'react';
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
  Paper
} from '@mui/material';

const EstimateRegion = () => {
  const [year, setYear] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('realExpenditures');

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = async () => {
    if (!year) {
      setError("Введіть рік.");
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`estimates/regions?year=${year}`);
      const data = response.data.map(i => ({ ...i, defenseRatio: i.realExpenditures ? i.defenseExpenditures / i.realExpenditures * 100: 0 }));
      setData(data);
    } catch (err) {
      setError("Помилка завантаження.");
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

  return (
    <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Статистика областей
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Рік"
          type="number"
          value={year}
          onChange={handleYearChange}
          variant="outlined"
          fullWidth
        />
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
                  <TableCell sortDirection={orderBy === 'defenseExpenditures' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'defenseExpenditures'}
                      direction={orderBy === 'defenseExpenditures' ? order : 'asc'}
                      onClick={() => handleRequestSort('defenseExpenditures')}
                    >
                      Витрати на оборону
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'defenseRatio' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'defenseRatio'}
                      direction={orderBy === 'defenseRatio' ? order : 'asc'}
                      onClick={() => handleRequestSort('defenseRatio')}
                    >
                      Співвдношення витрат на оборону
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy === 'region.name' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'region.name'}
                      direction={orderBy === 'region.name' ? order : 'asc'}
                      onClick={() => handleRequestSort('region.name')}
                    >
                      Область
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.tenderCount}</TableCell>
                    <TableCell>{parseFloat(item.realExpenditures).toLocaleString()}</TableCell>
                    <TableCell>{parseFloat(item.defenseExpenditures).toLocaleString()}</TableCell>
                    <TableCell>{parseFloat(item.defenseRatio).toLocaleString()}</TableCell>
                    <TableCell>{item.region.name}</TableCell>
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

export default EstimateRegion;
