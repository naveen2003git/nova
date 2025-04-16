import React, { useContext, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    Divider,
    Snackbar,
    Alert,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts, StorePayment, updateProductStockInFirestore } from '../../Utlies/service';
import { ThemeContext } from '../../Admin/ThemeContext/ThemeContext';

const steps = ['Order Summary', 'Delivery Address', 'Payment Options'];

const OrderPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems = [], total = 0 } = location.state || {};
    const themes = useContext(ThemeContext);

    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const inputFields = [
        { label: 'Full Name', name: 'name', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Phone Number', name: 'phone', type: 'tel' },
        { label: 'Address', name: 'address', type: 'text', multiline: true, rows: 3 },
        { label: 'City', name: 'city', type: 'text' },
        { label: 'Pincode', name: 'pincode', type: 'number' },
    ];

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNext = () => {
        if (activeStep === 1) {
            const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
            if (!allFieldsFilled) {
                setSnackbar({
                    open: true,
                    message: 'Please fill in all delivery address fields.',
                    severity: 'error',
                });
                return;
            }
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handlePayment = async () => {
        const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
            alert('Failed to load Razorpay');
            return;
        }

        const options = {
            key: 'rzp_test_xKzR1MlNCxBYOT',
            amount: total * 100,
            currency: 'INR',
            name: 'Nova Store',
            description: 'Order Payment',
            image: 'https://i.imgur.com/Zi6v09P.png',
            handler: async function (response) {
                setSnackbar({
                    open: true,
                    message: 'Payment successful! ID: ' + response.razorpay_payment_id,
                    severity: 'success',
                });

                StorePayment({
                    formData,
                    cartItems,
                    total,
                    paymentId: response.razorpay_payment_id,
                });

                await handlequantity();

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
            },
            notes: {
                items: JSON.stringify(cartItems),
            },
            theme: {
                color: '#6C63FF',
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handlequantity = async () => {
        let products = await getProducts();

        if (!Array.isArray(products)) {
            products = Object.entries(products).map(([id, data]) => ({
                id,
                ...data,
            }));
        }

        const updatedProducts = cartItems.map((cartItem) => {
            const fullProduct = products.find((p) => p.id === cartItem.id);
            if (!fullProduct) return null;

            const remainingQty = (fullProduct.quantity || 0) - cartItem.quantity;

            return {
                ...fullProduct,
                quantity: remainingQty >= 0 ? remainingQty : 0,
                cartQuantity: cartItem.quantity,
            };
        }).filter(Boolean);

        console.log(updatedProducts, 'Updated product stock after order');
        await updateProductStockInFirestore(updatedProducts);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">🧾 Order Summary</Typography>
                        {cartItems.map((item) => (
                            <Box key={item.id} sx={{ mb: 2 }}>
                                <Typography>{item.name} x {item.quantity}</Typography>
                                <Typography color="text.secondary">
                                    ₹{(item.price - (item.price * item.discount / 100)).toFixed(2)} each
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                            </Box>
                        ))}
                        <Typography variant="h6" fontWeight="bold">Total: ₹{total}</Typography>
                    </Paper>
                );

            case 1:
                return (
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">🚚 Delivery Address</Typography>
                        {inputFields.map((field) => (
                            <TextField
                                key={field.name}
                                fullWidth
                                label={field.label}
                                name={field.name}
                                type={field.type}
                                variant="outlined"
                                margin="normal"
                                value={formData[field.name]}
                                onChange={handleChange}
                                multiline={field.multiline || false}
                                rows={field.rows || 1}
                                required
                            />
                        ))}
                    </Paper>
                );

            case 2:
                return (
                    <Paper sx={{ p: 4, borderRadius: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">💳 Click to Pay</Typography>
                        <Button variant="contained" sx={{ backgroundColor: themes.primary }} onClick={handlePayment}>
                            Pay ₹{total}
                        </Button>
                    </Paper>
                );

            default:
                return null;
        }
    };

    return (
        <Container sx={{ mt: 5 }}>
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    mb: 4,
                    '& .MuiStepIcon-root': {
                        color: '#ccc',
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                        color: themes.primary,
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                        color: themes.primary,
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} color='black'>
                    Back
                </Button>
                {activeStep < steps.length - 1 && (
                    <Button variant="contained" onClick={handleNext} sx={{ backgroundColor: themes.primary }}>
                        Next
                    </Button>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default OrderPage;
