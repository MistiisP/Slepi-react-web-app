import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";

const SoldStats = ({ soldEggs, loading, error }) => {
    const [totalSold, setTotalSold] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const validSoldEggs = Array.isArray(soldEggs) ? soldEggs : [];
        const totalCount = validSoldEggs.reduce((sum, item) => sum + (Number(item.count) || 0), 0);

        const totalRevenue = validSoldEggs.reduce((sum, item) => {
            const count = Number(item.count) || 0;
            const pricePerUnit = Number(item.price) || 0;
            return sum + (count * pricePerUnit);
        }, 0);

        setTotalSold(totalCount);
        setTotalPrice(totalRevenue);
    }, [soldEggs]); 

    return (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }} id="sold-section">
            <Typography variant="h5" gutterBottom> 💰 Statistiky prodeje vajec </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
            ) : (
                <>
                    {(!soldEggs || soldEggs.length === 0) && !error ? (
                         <Typography sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary', py: 2 }}>
                            Zatím nebyly zaznamenány žádné prodeje.
                        </Typography>
                    ) : (
                         <>
                            <Typography variant="h6" sx={{ marginTop: "20px" }}>
                                Celkem prodáno vajec: {totalSold} ks
                            </Typography>
                            <Typography variant="h6" sx={{ marginTop: "10px" }}>
                                Celkový příjem z prodeje: {totalPrice.toFixed(2)} Kč
                            </Typography>
                         </>
                    )}
                </>
            )}
        </Paper>
    );
}

export default SoldStats;