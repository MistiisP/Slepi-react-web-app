import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { Container, Typography, Box, CircularProgress, Alert } from "@mui/material";

import ChickenCard from './components/ChickenCard';
import ChickenForm from './components/ChickenForm';
import EggsStats from './components/EggsStats';
import EggsForm from './components/EggsForm';
import SoldStats from './components/SoldStats';
import SoldForm from './components/SoldForm';
import FeedCalculator from './components/FeedCalculator';
import Layout from './components/Layout';

const App = () => {
  const [chickens, setChickens] = useState([]);
  const [soldEggs, setSoldEggs] = useState([]);
  const [eggRefreshKey, setEggRefreshKey] = useState(0);


  const [loadingChickens, setLoadingChickens] = useState(true);
  const [errorChickens, setErrorChickens] = useState(null);
  const [loadingSoldEggs, setLoadingSoldEggs] = useState(true);
  const [errorSoldEggs, setErrorSoldEggs] = useState(null);

  const fetchChickens = useCallback(async () => {
    setLoadingChickens(true);
    setErrorChickens(null);
    try {
      const response = await axios.get("/api/chickens");
      const chickenData = Array.isArray(response.data) ? response.data : [];
      setChickens(chickenData);
    } catch (error) {
      console.error("Chyba při načítání slepic:", error);
      setErrorChickens("Nepodařilo se načíst data o slepicích.");
      setChickens([]);
    } finally {
      setLoadingChickens(false);
    }
  }, []);


  const fetchSoldEggs = useCallback(async () => {
    setLoadingSoldEggs(true);
    setErrorSoldEggs(null);
    try {
      const response = await axios.get("/api/sold-eggs");
      const data = Array.isArray(response.data) ? response.data : [];
      setSoldEggs(data);
    } catch (err) {
      console.error("Chyba při načítání prodaných vajec:", err);
      setErrorSoldEggs("Nepodařilo se načíst data o prodaných vejcích.");
      setSoldEggs([]);
    } finally {
      setLoadingSoldEggs(false);
    }
  }, []);

  
  const triggerEggRefresh = () => {
    setEggRefreshKey(prevKey => prevKey + 1);
  };


  useEffect(() => {
    fetchChickens();
    fetchSoldEggs();
  }, [fetchChickens, fetchSoldEggs]);

  return (
    <>
      <Layout>
        <Container>
          <Box id="home">
            <Typography variant="h4" gutterBottom> 🐔 Slepičí farma </Typography>
            <Typography variant="body1" gutterBottom>
              Tato aplikace vám pomůže efektivně spravovat vaši slepičí farmu.
            </Typography>
          </Box>

          <Box id="chickens-section" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Naše Slepice</Typography>
            {loadingChickens ? <CircularProgress /> : errorChickens ? <Alert severity="error">{errorChickens}</Alert> : <ChickenCard chickens={chickens} />}
            <ChickenForm onChickenAdded={fetchChickens} />
          </Box>

          <Box id="eggs-section" sx={{ mt: 4 }}>
            <EggsStats refreshKey={eggRefreshKey} />
            <EggsForm onEggAdded={triggerEggRefresh} />
          </Box>

          <Box id="sold-section" sx={{ mt: 4 }}>
            <SoldStats soldEggs={soldEggs} loading={loadingSoldEggs} error={errorSoldEggs} />
            <SoldForm onSoldEggAdded={fetchSoldEggs} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <FeedCalculator />
          </Box>

        </Container>
      </Layout>
    </>
  );
};

export default App;
