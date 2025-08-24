import React from "react";
import { Box, Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";

const ChickenCard = ({ chickens }) => {

    const chickenArray = Array.isArray(chickens) ? chickens : [];

    return (
        <Grid container spacing={2} sx={{ mt: 1 }}>
            {chickenArray.length === 0 ? (
                 <Grid item xs={12}>
                    <Typography sx={{ textAlign: 'center', fontStyle: 'italic', color: 'text.secondary' }}>
                        Zatím nebyly přidány žádné slepice.
                    </Typography>
                 </Grid>
            ) : (
                chickenArray.map((chicken) => (
                    <Grid item key={chicken.id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}> 
                            <CardMedia
                                component="img"
                                alt={chicken.name}
                                height="140"
                                image={chicken.photoUrl || "https://via.placeholder.com/345x140.png?text=Foto+není+k+dispozici"} 
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {chicken.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Plemeno: {chicken.breed}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Věk: {chicken.ageInWeeks} týdnů
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {chicken.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default ChickenCard;