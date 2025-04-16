import React, { useState, useEffect, useContext } from 'react';
import { getUserOrderProducts } from '../../Utlies/service';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Container,
    CircularProgress,
    Chip,
} from '@mui/material';
import Footer from '../../component/Footer';
import { useNavigate } from 'react-router-dom';

import { ThemeContext } from '../../Admin/ThemeContext/ThemeContext';

const OrdersPage = () => {
    const navigate = useNavigate();

    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const themes = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orderValue = await getUserOrderProducts();

                if (orderValue?.orders?.length > 0) {
                    const allOrderedItems = orderValue.orders.flatMap(order =>
                        order.products.map(product => ({
                            ...product,
                            createdAt: order.createdAt?.seconds
                                ? new Date(order.createdAt.seconds * 1000)
                                : new Date(0),
                            paymentId: order.paymentId,
                        }))
                    );

                    const sortedItems = allOrderedItems.sort(
                        (a, b) => b.createdAt - a.createdAt
                    );

                    const finalItems = sortedItems.map(item => ({
                        ...item,
                        createdAt: item.createdAt.toLocaleDateString(),
                    }));

                    setUserOrders(finalItems);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch user orders:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Container sx={{ marginTop: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Loading your orders...
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Orders
            </Typography>
            <Grid container spacing={2} direction="column">
                {userOrders.length > 0 ? (
                    userOrders.map((item, index) => (
                        <Grid item key={index} xs={12}>
                            <Card
                                onClick={() => navigate(`/user/order/${item.paymentId}`, { state: { item } })}

                                sx={{
                                    cursor: 'pointer',

                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    width: '100%',
                                    p: { xs: 1, sm: 2 },
                                    alignItems: { xs: 'center', sm: 'flex-start' },
                                    textAlign: { xs: 'center', sm: 'left' },
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 6,
                                        backgroundColor: themes.background,
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: { xs: '100%', sm: 200 },
                                        height: { xs: 180, sm: 200 },
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                    }}
                                    image={item.image}
                                    alt={item.name}
                                />
                                <CardContent
                                    sx={{
                                        flex: 1,
                                        px: { xs: 1, sm: 2 },
                                        pt: { xs: 2, sm: 0 },
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{ wordBreak: 'break-word' }}
                                    >
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Quantity: {item.quantity}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Price: ₹{item.price}
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Ordered Date: {item.createdAt}
                                    </Typography>
                                    <Chip
                                        label={item.status}
                                        color={
                                            item.status === 'Ordered'
                                                ? 'primary'
                                                : item.status === 'Processing'
                                                ? 'warning'
                                                : item.status === 'Delivered'
                                                ? 'success'
                                                : item.status === 'Canceled'
                                                ? 'error'
                                                : 'default'
                                        }
                                        sx={{ mt: 1 }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        You haven't placed any orders yet.
                    </Typography>
                )}
            </Grid>
            <Footer />
        </Container>
    );
};

export default OrdersPage;
