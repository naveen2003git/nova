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
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { getUserCartProducts, removeCartItem } from '../../Utlies/service';
import { auth } from '../../Utlies/firebase';
import { useNavigate } from 'react-router-dom';
import Footer from '../../component/Footer';
  // eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ThemeContext } from '../../ThemeContext/ThemeContext';

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
      showSnackbar('Item removed!', 'success');
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
      if (stockInfo && stockInfo.quantity > 0 && stockInfo.stock===true) {
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

    // 🔴 Remove out-of-stock items
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
      console.log(isOutOfStock);
      console.log(stockInfo);
      console.log(stock,'stock');
      
      
      

      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              p: 2,
              borderBottom: '1px solid #ddd',
              flexDirection: { xs: 'column', sm: 'row' },
              opacity: isOutOfStock || stock ? 0.5 : 1, // fade only
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{
                width: 100,
                height: 100,
                objectFit: 'contain',
                backgroundColor: themes.background,
                borderRadius: 1,
              }}
            />
            <Box flex={1}>
              <Typography fontWeight="bold">{item.name}</Typography>
              <Typography fontSize="0.9rem" color="text.secondary">
                {item.description}
              </Typography>

              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <Typography color="text.secondary">
                  <s>₹{item.price}</s>
                </Typography>
                <Chip label={`${item.discount}% OFF`} size="small" color="success" />
              </Box>

              <Typography variant="h6" color="primary" mt={1}>
                ₹{calculateDiscountedPrice(item.price, item.discount).toFixed(2)}
              </Typography>

              <Box display="flex" alignItems="center" mt={1} gap={1}>
                <Tooltip title="Decrease quantity">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={isOutOfStock || item.quantity === 1}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>

                <Typography>{item.quantity}</Typography>

                <Tooltip title="Increase quantity">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      disabled={isOutOfStock || stock}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.selected}
                    onChange={e => handleCheckboxChange(item.id, e.target.checked)}
                    disabled={isOutOfStock || stock}
                    sx={{
                      color: themes.primary,
                      '&.Mui-checked': {
                        color: themes.primary,
                      },
                    }}
                  />
                }
                label={
                  isOutOfStock || stock ? (
                    <Typography variant="caption" color="error">
                      Out of Stock
                    </Typography>
                  ) : (
                    'Select'
                  )
                }
                sx={{ mt: 1 }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                mt: { xs: 1, sm: 0 },
              }}
            >
              <Tooltip title="Remove item from cart">
                <IconButton color="error" onClick={() => handleRemoveItem(item.id)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>
      );
    });
  };

  return (
    <div>
      <Container sx={{ py: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Container sx={{ marginTop: 4, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Loading your Cart...
              </Typography>
            </Container>
          </Box>
        ) : cartItems.length === 0 ? (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🛒 Your Cart
            </Typography>
            <Typography>Your cart is empty.</Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              🛒 Your Cart
            </Typography>
            {renderCartItems()}

            <Box
              sx={{
                mt: 4,
                p: 3,
                border: '1px solid #ccc',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  🧾 Total: ₹{getTotal().toFixed(2)}
                </Typography>
                <Typography fontSize="0.8rem" color="text.secondary">
                  {cartItems.filter(i => i.selected).length > 0
                    ? `${cartItems.filter(i => i.selected).length} item(s) selected`
                    : `(No items selected — all included by default)`}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleCheckout}
                disabled={isCheckoutDisabled()}
                sx={{ mt: { xs: 2, sm: 0 } }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </div>
  );
};

export default AddToCartPage;
