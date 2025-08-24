import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Alert, Snackbar, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { cs } from 'date-fns/locale';
import axios from "axios";

const EggsForm = ({ onEggAdded }) => {
    const [eggCount, setEggCount] = useState("");
    const [eggDate, setEggDate] = useState(new Date());
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        setSuccess(false); 

        if (!eggCount || isNaN(parseInt(eggCount)) || parseInt(eggCount) <= 0) { 
            setError("Zadejte platný kladný počet vajec");
            return;
        }
        if (!eggDate || !(eggDate instanceof Date) || isNaN(eggDate)) {
             setError("Zadejte platné datum");
             return;
        }

        try {
            const newEgg = {
                count: parseInt(eggCount),
                createdAt: eggDate.toISOString()
            };

            console.log("Odesílám data:", newEgg); 
            const response = await axios.post("/api/eggs", newEgg);
            console.log("Vejce byla úspěšně přidána:", response.data);

            setEggCount("");
            setEggDate(new Date());
            setSuccess(true);
            setError("");
            if (onEggAdded) {
                onEggAdded();
            }
        } catch (err) {
            console.error("Chyba při přidávání vajec:", err.response ? err.response.data : err.message);
            setError(`Nepodařilo se přidat vejce: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccess(false);
        setError("");
    };

    useEffect(() => {
        console.log("Aktuální hodnota eggDate (Date objekt):", eggDate);
    }, [eggDate]);

    return (
        <Box id="eggs-form-section" sx={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", marginTop: "20px" }}>
            <Typography variant="h5" gutterBottom>
                🥚 Přidat záznam o sběru vajec
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: "auto" }}>
                <TextField
                    label="Počet sebraných vajec" 
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={eggCount}
                    onChange={(e) => setEggCount(e.target.value)}
                    required
                    inputProps={{ min: 1 }}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
                    <DatePicker
                        label="Datum sběru"
                        value={eggDate}
                        onChange={(newDate) => setEggDate(newDate)}
                        maxDate={new Date()} 
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                margin: "normal",
                                required: true,
                                helperText: "Vyberte datum sběru"
                            }
                        }}
                    />
                </LocalizationProvider>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Přidat záznam
                </Button>
            </Box>

            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Záznam o vejcích byl úspěšně přidán!
                </Alert>
            </Snackbar>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EggsForm;