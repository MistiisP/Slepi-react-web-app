import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Button, IconButton, CircularProgress, Alert } from "@mui/material";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO } from 'date-fns';
import { cs } from 'date-fns/locale';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";

const getMonday = (date) => {
    return startOfWeek(date, { weekStartsOn: 1 });
};

const EggsStats = ({ refreshKey }) => {
    const [weekDate, setWeekDate] = useState(new Date());
    const [eggData, setEggData] = useState([]);
    const [totalEggs, setTotalEggs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const weekStart = getMonday(weekDate);
    const weekEnd = endOfWeek(weekDate, { weekStartsOn: 1 });

    const weekStartString = format(weekStart, 'yyyy-MM-dd');
    const weekEndString = format(weekEnd, 'yyyy-MM-dd');

    useEffect(() => {
        const fetchEggData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log(`EggsStats: Načítám data pro týden ${weekStartString} - ${weekEndString} (refreshKey: ${refreshKey})`); 

                const response = await axios.get("/api/eggs", {
                    params: {
                        startDate: weekStartString,
                        endDate: weekEndString
                    }
                });

                const eggs = Array.isArray(response.data) ? response.data : [];

                const daysOfWeek = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];
                const dailyData = daysOfWeek.map(day => ({ day, eggs: 0 }));

                eggs.forEach(egg => {
                    try {
                        const date = parseISO(egg.createdAt);
                        if (isNaN(date.getTime())) {
                            console.warn("Neplatné datum v záznamu o vejcích:", egg);
                            return;
                        }
                        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;

                        if (dayIndex >= 0 && dayIndex < 7) {
                            dailyData[dayIndex].eggs += egg.count;
                        } else {
                             console.warn("Neplatný index dne v týdnu pro datum:", date, egg);
                        }
                    } catch (parseError) {
                         console.error("Chyba při parsování data záznamu o vejcích:", egg.createdAt, parseError);
                    }
                });

                setEggData(dailyData);

            } catch (error) {
                console.error("Chyba při načítání dat o vejcích:", error);
                setError("Nepodařilo se načíst data o vejcích pro tento týden.");
                const fallbackData = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"].map(day => ({ day, eggs: 0 }));
                setEggData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchEggData();
    }, [weekStartString, weekEndString, refreshKey]);

     useEffect(() => {
        const total = eggData.reduce((sum, item) => sum + item.eggs, 0);
        setTotalEggs(total);
    }, [eggData]);


    const handlePreviousWeek = () => {
        setWeekDate(prevDate => subWeeks(prevDate, 1));
    };

    const handleNextWeek = () => {
        setWeekDate(prevDate => addWeeks(prevDate, 1));
    };


    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }} id="eggs-section">
            <Typography variant="h5" gutterBottom> 🥚 Statistiky sběru vajec </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2, flexWrap: 'wrap' }}>
                <IconButton onClick={handlePreviousWeek} aria-label="Předchozí týden" disabled={loading}>
                    <ArrowBackIosNewIcon />
                </IconButton>
                <Typography variant="h6" sx={{ marginX: { xs: 1, sm: 2 }, textAlign: 'center' }}>
                    Týden: {format(weekStart, 'd. M. yyyy', { locale: cs })} - {format(weekEnd, 'd. M. yyyy', { locale: cs })}
                </Typography>
                <IconButton onClick={handleNextWeek} aria-label="Následující týden" disabled={loading}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
            ) : (
                <>
                    <Grid container spacing={1} sx={{ marginBottom: 2, textAlign: 'center', alignItems: 'stretch' }}>
                        {eggData.map((item) => (
                            <Grid item xs={12/7} key={item.day} sx={{display: 'flex', minWidth: '100px'}}>
                                <Box sx={{
                                    border: '1px solid #ddd',
                                    padding: 1,
                                    borderRadius: 1,
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: item.eggs > 0 ? 'rgba(255, 236, 179, 0.3)' : 'inherit',
                                    transition: 'background-color 0.3s ease'
                                }}>
                                    <Typography variant="body2" fontWeight="bold">{item.day}</Typography>
                                    <Typography variant="h6">{item.eggs}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography variant="h6" sx={{ marginTop: "20px", textAlign: 'center', fontWeight: 'bold' }}>
                        Celkem za týden: {totalEggs} vajec
                    </Typography>
                </>
            )}
        </Paper>
    );
}

export default EggsStats;