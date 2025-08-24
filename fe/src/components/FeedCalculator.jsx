import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from "@mui/material"; 
import axios from "axios"; 

const DEFAULT_FEED_PER_CHICKEN_KG = 0.12; 

const FeedCalculator = () => {
    const [numChickens, setNumChickens] = useState('');
    const [numDays, setNumDays] = useState('');
    const [feedAmountPerChicken, setFeedAmountPerChicken] = useState(''); 

    const [loadingDefaults, setLoadingDefaults] = useState(true);
    const [errorDefaults, setErrorDefaults] = useState(null);
    const [fetchedDefaultChickens, setFetchedDefaultChickens] = useState('');
    const [fetchedDefaultFeed, setFetchedDefaultFeed] = useState('');

    const [calculatedFeed, setCalculatedFeed] = useState(null);

    useEffect(() => {
        const fetchChickenData = async () => {
            setLoadingDefaults(true);
            setErrorDefaults(null);
            try {
                const response = await axios.get('/api/chickens');
                const chickensData = Array.isArray(response.data) ? response.data : [];

                const defaultChickenCount = chickensData.length;
                setNumChickens(defaultChickenCount > 0 ? defaultChickenCount.toString() : '');
                setFetchedDefaultChickens(defaultChickenCount > 0 ? defaultChickenCount.toString() : '');

                let totalFeedGrams = 0;
                let chickensWithFeedData = 0;
                chickensData.forEach(chicken => {
                    if (chicken.needFood && typeof chicken.needFood === 'number' && chicken.needFood > 0) {
                        totalFeedGrams += chicken.needFood;
                        chickensWithFeedData++;
                    }
                });

                let averageFeedKg = DEFAULT_FEED_PER_CHICKEN_KG; 
                let isAverageCalculated = false;
                if (chickensWithFeedData > 0) {
                    averageFeedKg = (totalFeedGrams / chickensWithFeedData) / 1000;
                    isAverageCalculated = true;
                }

                const formattedAverageFeed = averageFeedKg.toFixed(2); 
                setFeedAmountPerChicken(formattedAverageFeed);
                setFetchedDefaultFeed(formattedAverageFeed);


            } catch (err) {
                console.error("Chyba při načítání dat slepic:", err);
                setErrorDefaults("Nepodařilo se načíst výchozí data pro kalkulačku.");
                setFeedAmountPerChicken(DEFAULT_FEED_PER_CHICKEN_KG.toString());
                setFetchedDefaultFeed(DEFAULT_FEED_PER_CHICKEN_KG.toString());
                setFetchedDefaultChickens('');
                setNumChickens('');
            } finally {
                setLoadingDefaults(false);
            }
        };

        fetchChickenData();
    }, []); 

    const calculateFeed = () => {
        const chickens = parseFloat(numChickens);
        const days = parseFloat(numDays);
        const feedPerChicken = parseFloat(feedAmountPerChicken);

        if (isNaN(chickens) || chickens <= 0 || isNaN(days) || days <= 0 || isNaN(feedPerChicken) || feedPerChicken <= 0) {
            setCalculatedFeed(null);
            alert("Zadejte prosím platná kladná čísla pro všechny hodnoty."); 
            return;
        }

        const totalAmount = chickens * days * feedPerChicken;
        setCalculatedFeed(totalAmount.toFixed(2));
    };


    const handleReset = () => {
        setNumChickens(fetchedDefaultChickens); 
        setNumDays('');
        setFeedAmountPerChicken(fetchedDefaultFeed);
        setCalculatedFeed(null); 
    };

    const isFeedAverage = fetchedDefaultFeed !== DEFAULT_FEED_PER_CHICKEN_KG.toFixed(2) && fetchedDefaultFeed !== DEFAULT_FEED_PER_CHICKEN_KG.toString();

    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }} id="feed-calculator-section">
            <Typography variant="h5" gutterBottom> 🐔 Kalkulačka krmiva </Typography>

            {loadingDefaults ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
                    <CircularProgress /> 
                    <Typography sx={{ ml: 2 }}>Načítám výchozí data...</Typography>
                </Box>
            ) : errorDefaults ? (
                 <Alert severity="warning" sx={{ mb: 2 }}>{errorDefaults} Používají se výchozí hodnoty.</Alert>
            ) : null}

            {(!loadingDefaults || errorDefaults) && (
                <Box component="form" noValidate autoComplete="off" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                    <TextField
                        label="Počet slepic"
                        type="number"
                        value={numChickens}
                        onChange={(e) => { setNumChickens(e.target.value); setCalculatedFeed(null); }} 
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { min: 1, step: "1" } }} 
                        helperText={fetchedDefaultChickens ? "Předvyplněno podle aktuálního stavu" : ""}
                    />
                    <TextField
                        label="Počet dní"
                        type="number"
                        value={numDays}
                        onChange={(e) => { setNumDays(e.target.value); setCalculatedFeed(null); }} 
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { min: 1, step: "1" } }}
                    />
                    <TextField
                        label="Množství krmiva na slepici a den (kg)"
                        type="number"
                        value={feedAmountPerChicken}
                        onChange={(e) => { setFeedAmountPerChicken(e.target.value); setCalculatedFeed(null); }} 
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { min: 0.01, step: "0.01" } }} 
                        helperText={isFeedAverage ? "Průměr podle aktuálního stavu" : "Výchozí hodnota"}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" color="primary" onClick={calculateFeed} disabled={loadingDefaults}>
                            Vypočítat
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleReset} disabled={loadingDefaults}>
                            Reset
                        </Button>
                    </Box>
                </Box>
            )}

            {calculatedFeed !== null && (
                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="h6">
                        Výsledek:
                    </Typography>
                    <Typography variant="body1">
                        Celková odhadovaná spotřeba krmiva: <strong>{calculatedFeed} kg</strong>
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

export default FeedCalculator;