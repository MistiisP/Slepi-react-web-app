import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Snackbar } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { cs } from 'date-fns/locale'; 
import axios from "axios";

const SoldForm = ({ onSoldEggAdded }) => {
    const [soldCount, setSoldCount] = useState(""); 
    const [price, setPrice] = useState("");
    const [soldDate, setSoldDate] = useState(new Date());
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");    

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!soldCount || isNaN(parseInt(soldCount)) || parseInt(soldCount) <= 0) {
            setError("Zadejte platný počet prodaných vajec.");
            return;
        }
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setError("Zadejte platnou cenu za vejce.");
            return;
        }
        if (!soldDate || !(soldDate instanceof Date) || isNaN(soldDate)) {
            setError("Zadejte platné datum prodeje.");
            return;
        }

        try {
            const newSoldEgg = {
                count: parseInt(soldCount),
                price: parseFloat(price),
                createdAt: soldDate.toISOString(),
            };

            console.log("Odesílám data o prodeji:", newSoldEgg);
            const response = await axios.post("/api/sold-eggs", newSoldEgg);
            console.log("Záznam o prodeji úspěšně přidán:", response.data);

            setSoldCount("");
            setPrice("");
            setSoldDate(new Date()); 
            setSuccess(true);
            setError("");
            if (onSoldEggAdded) {
                onSoldEggAdded();
            }

        } catch (err) {
            console.error("Chyba při přidávání záznamu o prodeji:", err.response ? err.response.data : err.message);
            setError("Nepodařilo se přidat záznam o prodeji. Zkontrolujte konzoli.");
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccess(false);
        setError("");
    };

    return (
        <Box id="sold-form-section" sx={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px", marginTop: "20px" }}>
            <Typography variant="h5" gutterBottom> 💰 Přidat prodaná vejce </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: "auto", display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Počet prodaných vajec"
                    type="number"
                    value={soldCount}
                    onChange={(e) => setSoldCount(e.target.value)}
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                />
                <TextField
                    label="Cena za vejce (Kč)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    fullWidth
                    inputProps={{ step: "0.1", min: 0.1 }} 
                />
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
                    <DatePicker
                        label="Datum prodeje"
                        value={soldDate}
                        onChange={(newDate) => setSoldDate(newDate)}
                        maxDate={new Date()} 
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: true,
                                helperText: "Vyberte datum prodeje"
                            }
                        }}
                    />
                </LocalizationProvider>

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                    Přidat záznam o prodeji
                </Button>
            </Box>

            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Záznam o prodeji byl úspěšně přidán!
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

export default SoldForm;