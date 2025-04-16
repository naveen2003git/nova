import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    CardMedia,
    Button,
    Chip,
    Box,
    Paper,
    Grid,
    Divider,
    Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { ThemeContext } from '../../ThemeContext/ThemeContext';
import { CurrencyRupee } from '@mui/icons-material';

const OrderDetails = () => {
    const themes = useContext(ThemeContext);
    const { state } = useLocation();
    const navigate = useNavigate();
    const item = state?.item;

    if (!item) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="text.secondary">No order details found.</Typography>
                    <Button
                        onClick={() => navigate(-1)}
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Go Back
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
            <Button
                onClick={() => navigate(-1)}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 4, color: themes.primary, borderColor: themes.primary }}
            >
                Back to Orders
            </Button>

            <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
                <Box sx={{ bgcolor: themes.primary, py: 2, px: 3 }}>
                    <Typography variant="h5" color="white" fontWeight="500">
                        Order Details
                    </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                    <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid item xs={12} md={5}>
                            <CardMedia
                                component="img"
                                image={item.image}
                                alt={item.name}
                                sx={{
                                    height: 280,
                                    objectFit: 'cover'
                                }}
                            />
                            <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="h6" gutterBottom fontWeight="500">
                                    {item.name}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Grid container spacing={6}>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, width: '100%' }}>
                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                            <Avatar sx={{ bgcolor: themes.primary }}>
                                                <ShoppingBagIcon />
                                            </Avatar>
                                            <Typography variant="h6">Order Quantity</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Quantity</Typography>
                                                <Typography variant="body1" fontWeight="500">{item.quantity}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, width: '100%' }}>
                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                            <Avatar sx={{ bgcolor: themes.primary }}>
                                                <CurrencyRupee />
                                            </Avatar>
                                            <Typography variant="h6">Order Price</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2" color="text.secondary">Price</Typography>
                                                <Typography variant="body1" fontWeight="500">₹{item.price}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, width: '100%' }}>
                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                            <Avatar sx={{ bgcolor: themes.primary }}>
                                                <PaymentIcon />
                                            </Avatar>
                                            <Typography variant="h6">Payment Details</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Typography variant="body2" color="text.secondary">Payment ID</Typography>
                                        <Typography variant="body1" fontWeight="500">{item.paymentId}</Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, width: '100%' }}>
                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                            <Avatar sx={{ bgcolor: themes.primary }}>
                                                <CalendarTodayIcon />
                                            </Avatar>
                                            <Typography variant="h6">Order Date</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Typography variant="body2" color="text.secondary">Ordered On</Typography>
                                        <Typography variant="body1" fontWeight="500">{item.createdAt}</Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, width: '100%' }}>
                                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                                            <Avatar sx={{ bgcolor: themes.primary }}>
                                                <LocalShippingIcon />
                                            </Avatar>
                                            <Typography variant="h6">Delivery Status</Typography>
                                        </Box>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Chip
                                            label={item.status}
                                            color={
                                                item.status === 'Ordered' ? 'primary'
                                                    : item.status === 'Processing' ? 'warning'
                                                        : item.status === 'Delivered' ? 'success'
                                                            : item.status === 'Canceled' ? 'error'
                                                                : 'default'
                                            }
                                            sx={{ fontWeight: 'medium' }}
                                        />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderDetails;
