import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  CardMedia,
  Box,
  Chip,
  Rating,
  Button,
  TextField,
  Divider,
  Paper,
  Dialog,
  Snackbar,
  Alert,
  Grid,
  Card,
  Avatar,
  Fade,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../Utlies/firebase";
import { cartProduct, productReview } from "../../Utlies/service";
import LoginDialog from "../../component/LoginDialog";
import { ThemeContext } from "../../ThemeContext/ThemeContext";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import SellIcon from '@mui/icons-material/Sell';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const themes = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Review input states
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isDelivered, setIsDelivered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          
          // Preload the image
          const img = new Image();
          img.src = docSnap.data().image;
          img.onload = () => setImageLoaded(true);
        } else {
          console.error("No such product!");
        }

        // Fetch reviews
        const reviewsRef = collection(doc(db, "products", id), "reviews");
        const reviewsSnap = await getDocs(reviewsRef);
        const reviewList = reviewsSnap.docs.map((doc) => doc.data());
        setReviews(reviewList);

        // Calculate average rating
        if (reviewList.length > 0) {
          const total = reviewList.reduce((sum, r) => sum + r.rating, 0);
          const avg = total / reviewList.length;
          setAverageRating(avg);
        } else {
          setAverageRating(0);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading product or reviews:", error);
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = auth.currentUser;
      if (!user) {
        setLoginDialogOpen(true);
      }
    }, 60000); // every 60 seconds

    return () => clearInterval(interval); // clear on unmount
  }, []);

  useEffect(() => {
    const checkIfDelivered = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoginDialogOpen(true);
        return;
      }

      try {
        const orderRef = doc(db, "orders", user.uid);
        const orderDoc = await getDoc(orderRef);

        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          
          let delivered = false;
          orderData.orders?.forEach(order => {
            const found = order.products?.find(
              (item) => item.id === id && item.status === "Delivered"
            );
            if (found) delivered = true;
          });

          setIsDelivered(delivered);
        } else {
          setIsDelivered(false);
        }
      } catch (error) {
        console.error("Error checking delivery status: ", error);
      }
    };

    checkIfDelivered();
  }, [id]);

  const handleCloseSnack = () => {
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const handleCart = async (id) => {
    const user = auth.currentUser;
    if (!user) {
      setLoginDialogOpen(true); // Show login dialog
      return;
    }

    try {
      const prod = await cartProduct(id, user.uid, setSnack);
      if (prod) console.log("Product added to cart successfully");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await productReview(product.id, comment, rating, product.name);
      console.log("Review submitted successfully");
      setComment("");
      setRating(0);

      // Refresh reviews
      const reviewsRef = collection(doc(db, "products", id), "reviews");
      const reviewsSnap = await getDocs(reviewsRef);
      const reviewList = reviewsSnap.docs.map((doc) => doc.data());
      setReviews(reviewList);

      // Update average rating
      if (reviewList.length > 0) {
        const total = reviewList.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / reviewList.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
      
      setSnack({
        open: true,
        message: "Review submitted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error submitting review:", err);
      setSnack({
        open: true,
        message: "Failed to submit review. Please try again.",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: themes.primary }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            Loading amazing product...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h5" color="error" gutterBottom>
            Product not found
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            The product you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate(-1)} 
            sx={{ mt: 2, bgcolor: themes.primary }}
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  const discountPrice = (
    product?.price -
    (product?.price * (product?.discount / 100))
  ).toFixed(2);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box>
          {/* Back Button */}
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)} 
            sx={{ 
              mb: 3, 
              color: themes.primary, 
              borderColor: themes.primary,
              borderRadius: 2,
              px: 2,
              "&:hover": {
                backgroundColor: `${themes.primary}10`,
              }
            }}
            startIcon={<ArrowBackIcon />}
          >
            Back to Products
          </Button>

          {/* Main Product Content */}
          <Paper 
            elevation={5} 
            sx={{ 
              borderRadius: 4, 
              overflow: "hidden",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }
            }}
          >
            <Grid container>
              {/* Product Image Section */}
              <Grid item xs={12} md={5} position="relative">
                <Box 
                  sx={{ 
                    bgcolor: "#f5f5f5", 
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    position: "relative"
                  }}
                >
                  <Fade in={imageLoaded} timeout={1000}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      onLoad={() => setImageLoaded(true)}
                      sx={{
                        maxHeight: "300px",
                        width: "300px",
                        objectFit: "contain",
                        transition: "transform 0.5s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        }
                      }}
                    />
                  </Fade>
                  
                  {product.discount > 60 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        backgroundColor: "red",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        boxShadow: "0 4px 12px rgba(255,0,0,0.3)",
                        transform: "rotate(5deg)",
                        zIndex: 1,
                      }}
                    >
                      <Typography variant="h6" color="#fff" fontWeight={700} fontSize={isMobile ? 14 : 18}>
                        HOT DEAL!
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              {/* Product Details Section */}
              <Grid item xs={12} md={7}>
                <Box sx={{ p: { xs: 3, md: 5 },marginTop:6 }}>
                  <Box mb={1} sx={{width:500}}>
                    <Typography variant="subtitle1" fontWeight={600} color={themes.primary}>
                      {product.brand}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {product.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating 
                        value={averageRating} 
                        readOnly 
                        precision={0.5} 
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                      />
                      <Typography variant="body2" sx={{ ml: 1, mr: 1 }}>
                        ({averageRating.toFixed(1)})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Pricing Section */}
                  <Box mb={3}>
                    <Box display="flex" alignItems="baseline" mb={1}>
                      <Typography variant="h4" fontWeight="bold" color={themes.primary}>
                        ₹{discountPrice}
                      </Typography>
                      {product.discount > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              textDecoration: "line-through",
                              color: "text.secondary",
                            }}
                          >
                            ₹{product?.price}
                          </Typography>
                          <Chip 
                            icon={<SellIcon fontSize="small" />} 
                            label={`${product.discount}% OFF`} 
                            color="success" 
                            size="small" 
                            sx={{ ml: 1, fontWeight: 'bold' }} 
                          />
                        </Box>
                      )}
                    </Box>
                    
                    {product.quantity <= 10 && (
                      <Box
                        sx={{
                          bgcolor: "#fef2f2",
                          border: "1px solid #fee2e2",
                          p: 1.5,
                          borderRadius: 2,
                          width: "fit-content",
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ShoppingBagIcon color="error" fontSize="small" />
                        <Typography variant="body2" color="error.main" fontWeight={600} sx={{ ml: 1 }}>
                          Only {product.quantity} left in stock - Order soon!
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Description */}
                  <Typography variant="body1" color="text.secondary" paragraph sx={{width:700}}>
                    {product.description}
                  </Typography>

                  {/* Action Button */}
                  <Box mt={4} mb={3}>
                    {product.quantity > 0 ? (
                      <Button
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: "1rem",
                          fontWeight: 600,
                          background: themes.primary,
                          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                          }
                        }}
                        onClick={() => handleCart(product.id)}
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: "1rem",
                          fontWeight: 600,
                          background: "#9e9e9e",
                        }}
                        disabled
                      >
                        Out of Stock
                      </Button>
                    )}
                  </Box>

                  {/* Features */}
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalShippingIcon sx={{ color: themes.primary, mr: 1.5 }} />
                        <Typography variant="body2">Free Delivery Available</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityIcon sx={{ color: themes.primary, mr: 1.5 }} />
                        <Typography variant="body2">Secure Payment</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Review Section */}
          <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ mr: 1, color: themes.primary }} />
              Customer Reviews
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {/* Write a Review */}
            {isDelivered && (
              <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Leave a Review
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="body2" mr={2}>Your Rating:</Typography>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(e, newValue) => setRating(newValue)}
                    precision={0.5}
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Write your review..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button 
                  variant="contained" 
                  endIcon={<SendIcon />}
                  onClick={handleReviewSubmit} 
                  sx={{ 
                    background: themes.primary,
                    borderRadius: 2,
                    px: 3
                  }}
                >
                  Submit Review
                </Button>
              </Paper>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <Grid container spacing={3}>
                {reviews
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((rev, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 3,
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center" mb={1.5}>
                          <Avatar sx={{ bgcolor: themes.primary, mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {rev.Name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {rev.createdAt.toDate().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </Typography>
                          </Box>
                          <Box ml="auto">
                            <Rating value={rev.rating} readOnly size="small" />
                          </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                          {rev.comment}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 4, 
                  borderRadius: 3, 
                  textAlign: "center",
                  bgcolor: "#f9f9f9"
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No reviews yet. Be the first to review this product!
                </Typography>
              </Paper>
            )}
          </Box>
          
          <Snackbar
            open={snack.open}
            autoHideDuration={3000}
            onClose={handleCloseSnack}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={handleCloseSnack}
              severity={snack.severity}
              sx={{ width: "100%", boxShadow: 3 }}
            >
              {snack.message}
            </Alert>
          </Snackbar>

          <LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
        </Box>
      </Fade>
    </Container>
  );
};

export default ProductDetailPage;