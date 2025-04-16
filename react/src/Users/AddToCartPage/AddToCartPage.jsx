import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  IconButton,
  Box,
  Chip,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Paper,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Badge,
  Fade,
} from '@mui/material';
import {
  Add,
  Remove,
  DeleteOutline,
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircleOutline,
} from '@mui/icons-material';
import { getUserCartProducts, removeCartItem } from '../../Utlies/service';
import { auth } from '../../Utlies/firebase';
import { useNavigate } from 'react-router-dom';
import Footer from '../../component/Footer';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../ThemeContext/ThemeContext';
import ProductCard from './ProductCard';

const AddToCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productQty, setProductQty] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();
  const themes = useContext(ThemeContext);

  const fetchData = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      const products = await getUserCartProducts(user);
      setProductQty(products);

      if (Array.isArray(products)) {
        const initialized = products.map(item => ({
          ...item,
          quantity: 1,
          selected: false,
        }));
        setCartItems(initialized);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuantityChange = (id, delta) => {
    const product = productQty.find(q => q.id === id);
    if (!product) return;

    const availableStock = product.quantity;

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty > availableStock) {
            alert(`Only ${availableStock} in stock!`);
            return item;
          }
          return {
            ...item,
            quantity: Math.max(1, newQty),
          };
        }
        return item;
      })
    );
  };

  const handleCheckboxChange = (id, checked) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: checked } : item
      )
    );
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleRemoveItem = async id => {
    const user = auth.currentUser;
    try {
      await removeCartItem(id, user);
      fetchData();
      showSnackbar('Item removed from cart!', 'success');
    } catch (error) {
      showSnackbar('Failed to remove item.', error);
    }
  };

  const calculateDiscountedPrice = (price, discount) =>
    price - (price * discount) / 100;

  const getTotal = () => {
    const selectedItems = cartItems.filter(i => i.selected);
    const items = selectedItems.length > 0 ? selectedItems : cartItems;

    // Only include in-stock items in total
    return items.reduce((total, item) => {
      const stockInfo = productQty.find(p => p.id === item.id);
      if (stockInfo && stockInfo.quantity > 0 && stockInfo.stock === true) {
        return total + calculateDiscountedPrice(item.price, item.discount) * item.quantity;
      }
      return total;
    }, 0);
  };

  const isCheckoutDisabled = () => {
    const selectedItems = cartItems.filter(i => i.selected);
    const itemsToCheck = selectedItems.length > 0 ? selectedItems : cartItems;

    return !itemsToCheck.some(item => {
      const stockInfo = productQty.find(p => p.id === item.id);
      return stockInfo && stockInfo.quantity > 0;
    });
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(i => i.selected);
    const itemsToCheck = selectedItems.length > 0 ? selectedItems : cartItems;

    // Remove out-of-stock items
    const validItems = itemsToCheck.filter(item => {
      const stockInfo = productQty.find(p => p.id === item.id);
      return stockInfo && stockInfo.quantity > 0 && stockInfo.stock;
    });

    if (validItems.length === 0) {
      showSnackbar('No in-stock items to checkout.', 'warning');
      return;
    }

    navigate('/user/payment', {
      state: {
        cartItems: validItems,
        total: validItems
          .reduce(
            (total, item) =>
              total +
              calculateDiscountedPrice(item.price, item.discount) * item.quantity,
            0
          )
          .toFixed(2),
      },
    });
  };

  const renderCartItems = () => {
    return cartItems.map((item, i) => {
      const stockInfo = productQty.find(p => p.id === item.id);
      const isOutOfStock = Number(stockInfo?.quantity) === 0;
      const stock = stockInfo?.stock === false;

      
      return (
        <ProductCard
        key={item.id}
          item={item}
          i={i}
          handleCheckboxChange={handleCheckboxChange}
          handleQuantityChange={handleQuantityChange}
          handleRemoveItem={handleRemoveItem}
          isOutOfStock={isOutOfStock}
          stock={stock}
          themes={themes}
        />
      );
    });
  };
  
  const cartItem = cartItems.filter(p => p.stock);

  return (
    <Box sx={{ backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <ShoppingCart sx={{ fontSize: 32, mr: 2, color: themes.primary || '#1976d2' }} />
          <Typography variant="h4" fontWeight="bold">
            Your Shopping Cart
          </Typography>
        </Box>
        
        {loading ? (
          <Paper elevation={2} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
              Loading your cart items...
            </Typography>
          </Paper>
        ) : cartItems.length === 0 ? (
          <Paper elevation={2} sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
            <ShoppingCart sx={{ fontSize: 80, color: '#9e9e9e', mb: 2 }} />
            <Typography variant="h5" fontWeight="medium" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 3 }}
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 3 }}>
            <Box sx={{ flex: 3 }}>
              {renderCartItems()}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  position: 'sticky',
                  top: 160,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Items {cartItem.length }</Typography>
                  <Typography>₹{getTotal().toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography color="success.main">Free</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">Total</Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{getTotal().toFixed(2)}
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                  disabled={isCheckoutDisabled()}
                  startIcon={<Payment />}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    background: themes.primary || 'primary',
                    '&:hover': {
                      background: themes.primary ? `${themes.primary}dd` : '',
                    }
                  }}
                >
                  Checkout
                </Button>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalShipping fontSize="small" color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium" color="success.main">
                      Free shipping on all orders!
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Items usually ship within 24 hours.
                  </Typography>
                </Box>
                
                {cartItems.filter(i => i.selected).length > 0 && (
                  <Typography fontSize="0.8rem" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    {`${cartItems.filter(i => i.selected).length} item(s) selected`}
                  </Typography>
                )}
              </Paper>
            </Box>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default AddToCartPage;