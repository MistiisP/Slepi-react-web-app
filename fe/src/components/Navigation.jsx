import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu'; 

const Navigation = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };


    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setDrawerOpen(false);
    };

    const menuItems = [
        { text: 'Domů', id: 'home' },
        { text: 'Slepice', id: 'chickens-section' },
        { text: 'Vejce', id: 'eggs-section' },
        { text: 'Krmivo', id: 'feed-calculator-section' },
    ];

    const drawerList = () => (
        <Box
            sx={{ width: 250 }} 
            role="presentation"
            onClick={toggleDrawer(false)} 
            onKeyDown={toggleDrawer(false)} 
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => scrollToSection(item.id)}>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        🐔 Slepičí farma
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {menuItems.map((item) => (
                            <Button key={item.text} color="inherit" onClick={() => scrollToSection(item.id)}>
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={toggleDrawer(true)}
                        sx={{ display: { xs: 'block', sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={drawerOpen} 
                onClose={toggleDrawer(false)} 
            >
                {drawerList()}
            </Drawer>
        </>
    );
};

export default Navigation;