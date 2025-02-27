import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose1 = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Getting Clear</Typography>
          
          <div>
            {/* Menu 1 Button */}
            <Button color="inherit" onClick={handleClick1}>Статистика</Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose1}
            >
              <MenuItem component={Link} to="/estimates/items" onClick={handleClose1}>Товари</MenuItem>
              <MenuItem component={Link} to="/estimates/localities" onClick={handleClose1}>Міста</MenuItem>
              <MenuItem component={Link} to="/estimates/regions" onClick={handleClose1}>Області</MenuItem>
            </Menu>

            <Button color="inherit" onClick={handleClick2}>Аналіз</Button>
            <Menu
              anchorEl={anchorEl2}
              open={Boolean(anchorEl2)}
              onClose={handleClose2}
            >
              <MenuItem component={Link} to="/inspections/tenders" onClick={handleClose2}>Один тендер</MenuItem>
              <MenuItem component={Link} to="/inspections/localities" onClick={handleClose2}>Міста</MenuItem>
              <MenuItem component={Link} to="/inspections/regions" onClick={handleClose2}>Області</MenuItem>
            </Menu>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
