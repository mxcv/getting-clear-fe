import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './Header';
import EstimateRegion from './estimates/EstimateRegion';
import EstimateLocality from './estimates/EstimateLocality';
import EstimateItem from './estimates/EstimateItem';
import InspectTender from './inspections/InpectTender';
import InspectRegion from './inspections/InspectRegion';
import InspectLocality from './inspections/InspectLocality';

const Home = () => {
  return <div><h2>Welcome to the Home Page!</h2></div>;
};

const App = () => {
  return (
    <Router>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/estimates/regions" element={<EstimateRegion />} />
          <Route path="/estimates/localities" element={<EstimateLocality />} />
          <Route path="/estimates/items" element={<EstimateItem />} />
          <Route path="/inspections/tenders/:tenderId?" element={<InspectTender />} />
          <Route path="/inspections/localities" element={<InspectLocality />} />
          <Route path="/inspections/regions" element={<InspectRegion />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
