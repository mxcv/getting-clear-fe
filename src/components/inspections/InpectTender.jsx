import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const InspectTender = () => {
  const { tenderId: paramTenderId } = useParams();
  const navigate = useNavigate();
  const [tenderId, setTenderId] = useState(paramTenderId || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (paramTenderId) {
      fetchTenderData(paramTenderId);
    }
  }, [paramTenderId]);

  const handleTenderIdChange = (e) => {
    setTenderId(e.target.value);
  };

  const fetchTenderData = async (id) => {
    if (!id) {
      setError('Введіть дійсний ідентифікатор тендеру');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const inspection = await axios.get(`/inspections/tenders/${id}`);
      const tender = await axios.get(`/tenders/${id}`);
      console.log({ inspection: inspection.data, tender: tender.data });
      setData({ inspection: inspection.data, tender: tender.data });
    } catch (err) {
      setError('Помилка завантаження.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = () => {
    fetchTenderData(tenderId);
    navigate(`/inspections/tenders/${tenderId}`);
  };

  const getColor = (total, max) => {
    const ratio = total / max;
    let red, green;

    if (ratio <= 0.5) {
      red = Math.round(510 * ratio);
      green = 255;
    } else {
      red = 255;
      green = Math.round(510 * (1 - ratio));
    }

    return `rgba(${red}, ${green}, 0, 0.8)`;
  };

  const getIndicatorGauge = (title, value) => {
    return (
      <Box>
        <Gauge width={150} height={150} startAngle={-90} endAngle={90} valueMax={50} innerRadius={45} value={value}
        cornerRadius="20%"
        sx={(theme) => ({
          mx: 'auto',
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 25,
            fontFamily: 'sans-serif',
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: getColor(value, 25),
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })} />
        <Typography mt={-4} align='center'>{title}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Аналіз тендеру
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          label="ID тендеру"
          type="text"
          value={tenderId}
          onChange={handleTenderIdChange}
          variant="outlined"
          fullWidth
          disabled={loading}
          sx={{minWidth: 310}}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchData}
          disabled={loading || !tenderId}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Завантажити"}
        </Button>
      </Grid>

      {error && (
        <Grid item xs={12}>
          <Typography color="error">{error}</Typography>
        </Grid>
      )}

      {data && (
        <Grid item xs={12} md={8} style={{ width: '100%' }}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Box mb={2}>
              <Typography variant="h5">{data.tender.title}</Typography>
              <Typography variant="h4" align='right'>{data.inspection.details.realTotalPrice?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography>
            </Box>

            <Divider style={{ margin: '16px 0' }} />

            <Box>
              <Typography variant="h5">Результати аналізу</Typography>
              <Box sx={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row'}}>
              <Box>
                <Gauge width={180} height={180} valueMax={100} innerRadius={60} value={data.inspection.corruptionProbability.total}
                cornerRadius="50%"
                sx={(theme) => ({
                  mx: 'auto',
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 35,
                    fontFamily: 'sans-serif',
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: getColor(data.inspection.corruptionProbability.total, 40),
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: theme.palette.text.disabled,
                  },
                })} />
                <Typography align='center'>Загальна оцінка</Typography>
              </Box>
                {getIndicatorGauge('Порівняння ціни на товар', data.inspection.corruptionProbability.items)}
                {getIndicatorGauge('Співвідношення із громадою', data.inspection.corruptionProbability.locality)}
                {getIndicatorGauge('Історія постачальників', data.inspection.corruptionProbability.suppliers)}
              </Box>
            </Box>

            <Divider style={{ margin: '16px 0' }} />

            <Box mb={2}>
              <Typography variant="h5">Порівняння ціни на товар</Typography>
              <TableContainer component={Paper} mt={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell>Кількість</TableCell>
                      <TableCell>Одиниця виміру</TableCell>
                      <TableCell>Очікувана ціна за одиницю</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {data.inspection.details.expectedItemPricesPerOne.map((i, index) => (
                    <TableRow key={index}>
                      <TableCell>{i.classification}</TableCell>
                      <TableCell>{i.quantity}</TableCell>
                      <TableCell>{i.unit}</TableCell>
                      <TableCell>{i.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box>
              <Typography>Очікувана ціна: {data.inspection.details.expectedTotalPrice?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography>
              <Typography>Відношення: {(data.inspection.details.realExpectedPriceRatio)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography>
            </Box>

            <Divider style={{ margin: '16px 0' }} />

            <Box mb={2}>
              <Typography variant="h5">Співвідношення із величиною громади</Typography>
            </Box>

            <Box mb={2}>
            <Typography>Місто: {data.inspection.details.locality}</Typography>
            <Typography>Замовник є військовою організацією: {data.inspection.details.isDefence ? "Так" : "Ні"}</Typography>
              <Typography>Частина від річного бюджету міста: {(data.inspection.details.localityYearEstimateRatio * 100)?.toLocaleString()}%</Typography>
            </Box>

            <Divider style={{ margin: '16px 0' }} />

            <Box mb={2}>
              <Typography variant="h5">Історія постачальників</Typography>
              <Table component={Paper}>
                <TableHead>
                  <TableRow>
                    <TableCell>Постачальник</TableCell>
                    <TableCell>Кількість перемог</TableCell>
                    <TableCell>Середня ціна тендерів</TableCell>
                    <TableCell>Максимальна ціна тендеру</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {Object.entries(data.inspection.details.previosSupplierTenderPrices).map(([supplier, details]) => (
                  <TableRow key={supplier}>
                    <TableCell>{data.tender.awards.find(a => a.status === 'active').suppliers.find(s => s.identifier.id === supplier).name}</TableCell>
                    <TableCell>{details.count}</TableCell>
                    <TableCell>{details.average?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                    <TableCell>{details.max?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default InspectTender;
