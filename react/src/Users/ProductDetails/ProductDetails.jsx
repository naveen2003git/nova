import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  CardMedia,
  CardContent,
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

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const themes = useContext(ThemeContext);

  // Review input states
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
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

  const [isDelivered, setIsDelivered] = useState(false);

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
          console.log(orderData, 'orderDoc');

          let delivered = false;

          // Loop through each order and its products
          orderData.orders?.forEach(order => {
            const found = order.products?.find(
              (item) => item.id === id && item.status === "Delivered"
            );
            if (found) delivered = true;
          });

          console.log(delivered ? "Product delivered" : "Not delivered");
          setIsDelivered(delivered); // or setIsDelivered if renamed
        } else {
          setIsDelivered(false);
        }
      } catch (error) {
        console.error("Error checking delivery status: ", error);
      }
    };

    checkIfDelivered();
  }, [id]);



  // Later in your component:
  // {isInCart ? <Button disabled>In Cart</Button> : <Button>Add to Cart</Button>}



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
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5, mb: 8 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2, color: themes.primary, borderColor: themes.primary }}>
        ← Back
      </Button>

      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{
            width: { xs: "100%", md: "400px" },
            height: "auto",
            objectFit: "contain",
            borderRadius: 2,
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.brand}
          </Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {product.description}
          </Typography>

          {product.discount >60 &&
                      <Box
                      sx={{
                        backgroundColor: "red",
                        border: "1px solid #ff9800",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        display: "inline-block",
                        width: "fit-content",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2" color={themes.text} fontWeight={600}>
                        LIMITED OFFER !!
                      </Typography>
                    </Box>
          }

          <Box display="flex" alignItems="center" gap={2} mt={2}>

            <Typography variant="h6" fontWeight="bold" color="success.main">
              ₹
              {(
                product?.price -
                (product?.price * (product?.discount / 100))
              ).toFixed(2)}
            </Typography>
            {product.discount && (
              <Chip label={`${product.discount}% OFF`} color="success" />
            )}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{
              color: themes.primary,
              fontSize: "0.85rem",
            }}>M.R.P: </Typography>
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: themes.primary,
                fontSize: "0.85rem",
                marginLeft: 1
              }}
            >
              ₹{product?.price}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#fff3e0",
              border: "1px solid #ff9800",
              padding: "4px 12px",
              borderRadius: "12px",
              display: "inline-block",
              width: "fit-content",
              mt: 1,
            }}
          >
            <Typography variant="body2" color="warning.main" fontWeight={600}>
              Only {product.quantity} left in stock!
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', mt: 2 }}>
            <Rating value={averageRating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ mx: 1 }}>
              ({averageRating.toFixed(1)})
            </Typography>
          </Box>
          <Box mt={4}>
            {product.quantity > 0 ? (
              <Button
                variant="contained"
                sx={{ mr: 2, background: themes.primary }}
                onClick={() => handleCart(product.id)}
              >
                Add to Cart
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ mr: 2, background: themes.background }}
                disabled
              >
                Out of Stock
              </Button>
            )}
          </Box>

        </CardContent>
      </Box>

      {/* Review Section */}
      {isDelivered ? <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Leave a Review
        </Typography>
        <Box mb={2}>
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
        />
        <Box mt={2}>
          <Button variant="contained" onClick={handleReviewSubmit} sx={{ background: themes.primary }}>
            Submit Review
          </Button>
        </Box>
      </Box> : ''}

      {/* Display Reviews */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {reviews.length > 0 ? (
          reviews
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((rev, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {rev.Name}
                  </Typography>
                  <Rating value={rev.rating} readOnly size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {rev.comment}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {rev.createdAt.toDate().toLocaleDateString()}
                </Typography>
              </Paper>
            ))
        ) : (
          <Typography>No reviews yet.</Typography>
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
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />


    </Container>
  );
};

export default ProductDetailPage;
     