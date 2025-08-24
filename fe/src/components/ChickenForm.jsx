import React, { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar, Alert } from "@mui/material";
import axios from "axios";


const ChickenForm = ({ onChickenAdded }) => {
    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [foodAmount, setFoodAmount] = useState("");
    const [age, setAge] = useState("");

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        setSuccess(false); 

        if (!name || !breed || !description || !image || !foodAmount || !age) {
            setError("Všechna pole jsou povinná.");
            return;
        }
        if (isNaN(parseFloat(foodAmount)) || parseFloat(foodAmount) <= 0) {
            setError("Zadejte platné množství krmiva (kladné číslo).");
            return;
        }
        if (isNaN(parseInt(age)) || parseInt(age) <= 0) {
            setError("Zadejte platný věk (kladné celé číslo).");
            return;
        }

        const newChicken = {
            name,
            breed,
            description,
            photoUrl: image,
            needFood: parseFloat(foodAmount),
            ageInWeeks: parseInt(age),
        };

        try {
            const response = await axios.post("/api/chickens", newChicken);
            console.log("Slepice byla úspěšně přidána:", response.data);
            setName("");
            setBreed("");
            setDescription("");
            setImage("");
            setFoodAmount("");
            setAge("");
            setSuccess(true);
            if (onChickenAdded) {
                onChickenAdded();
            }
        } catch (err) {
            console.error("Chyba při přidávání slepice:", err.response ? err.response.data : err.message);
            setError(`Nepodařilo se přidat slepici: ${err.response?.data?.error || err.message}`); // Zobrazit chybovou notifikaci
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
        <Box id="chicken-form-section" component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
                Přidat novou slepici
            </Typography>
            <TextField
                label="Jméno"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
                label="Rasa"
                variant="outlined"
                fullWidth
                margin="normal"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                required
            />
            <TextField
                label="Popis"
                variant="outlined"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <TextField
                label="URL Obrázek"
                variant="outlined"
                fullWidth
                margin="normal"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                type="url" 
            />
            <TextField
                label="Denní spotřeba krmiva (g)"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={foodAmount}
                onChange={(e) => setFoodAmount(e.target.value)}
                required
                inputProps={{ min: 1, step: "1" }} 
            />
            <TextField
                label="Věk (týdny)" 
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                inputProps={{ min: 1, step: "1" }} 
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Přidat Slepici
            </Button>
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Slepice byla úspěšně přidána!
                </Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChickenForm;