
import React from "react";
import { Box, Typography } from "@mui/material";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
    return (
        <Box sx={{
            backgroundColor: "#f0f4f8", 
            padding: '5px', 
            minHeight: "100vh", 
            display: "flex",
            flexDirection: "column",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            color: '#333',
            fontSize: '16px',
            lineHeight: '1.5',
            
            }}>
            <Navigation />
            <Box component="main" sx={{
                marginTop: 2, 
                padding: 2,  
                backgroundColor: "#fff", 
                borderRadius: 2, 
                flexGrow: 1 
            }}>
            </Box>

            <Box component="footer" sx={{
                marginTop: 2, 
                padding: 2, 
                backgroundColor: "#fff",
                borderRadius: 2, 
                textAlign: 'center' 
             }}>
                <Typography variant="body2" color="text.secondary">
                    © {new Date().getFullYear()} Slepičí farma. Všechna práva vyhrazena.
                </Typography>
            </Box>
        </Box>
    );
}

export default Layout;