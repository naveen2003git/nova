import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
  Chip,
  Rating,
  Skeleton,
  Snackbar,
  Alert,
  Dialog,
  InputAdornment,
  IconButton,
  Drawer,
  Fab,
  Zoom,
  useTheme,
  useMediaQuery,
  Badge,
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  collection,
  getDocs,
} from "../../Utlies/firebase";
import { cartProduct } from "../../Utlies/service";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterListIcon from "@mui/icons-material/FilterList";
import LoginDialog from "../../component/LoginDialog";
import Footer from "../../component/Footer";
import { ThemeContext } from "../../ThemeContext/ThemeContext";


const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const themes = useContext(ThemeContext);

  // FAB Scroll to Top
  // eslint-disable-next-line no-unused-vars
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (id) => {
    navigate(`/user/productdetails/${id}`);
  };

  const handleCloseSnack = () => {
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const handleCart = async (id) => {
    const user = auth.currentUser;
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    try {
      const prod = await cartProduct(id, user.uid, setSnack);
      if (prod) console.log("Product added to cart successfully");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const productList = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const productData = { id: doc.id, ...doc.data() };
            const reviewsSnap = await getDocs(
              collection(db, "products", doc.id, "reviews")
            );
            const reviews = reviewsSnap.docs.map((r) => r.data());
            const avgRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;

            return { ...productData, rating: avgRating };
          })
        );
        setProducts(productList);
        setLoading(false);
      } catch (error) {
        console.error("Error loading products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const user = auth.currentUser;
      if (!user) {
        setLoginDialogOpen(true);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        (category === "All" || product.category === category) && product.stock === true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low-to-high") return a.price - b.price;
      if (sortBy === "price-high-to-low") return b.price - a.price;
      if (sortBy === "rating-high-to-low") return b.rating - a.rating;
      return 0;
    });

  return (
    <div sx={{ mt: 3, mb: 8 }}>
      {/* Sticky Filter Bar */}
      <Box
        sx={{
          position: "sticky",
          top: 70,
          zIndex: 1000,
          backgroundColor: themes.background,
          py: 4,
          px: 2,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, maxWidth: 300 }}
        />

        {isMobile ? (
          <IconButton onClick={() => setFilterDrawerOpen(true)}>
            <FilterListIcon />
          </IconButton>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mx: 2 }}>
              {["All", "Accessories", "Electronics", "Gadgets", "Shoes"].map(
                (cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    sx={{
                      bgcolor: category === cat ? themes.primary : "transparent",
                      color: category === cat ? themes.text : "inherit",
                      borderColor: category === cat ? themes.primary : undefined,
                      "&:hover": {
                        bgcolor: category === cat ? themes.text : "#f1f1f1",
                        color: category === cat ? themes.primary : "black",
                      },
                    }}
                    variant={category === cat ? "filled" : "outlined"}
                    onClick={() => setCategory(cat)}
                  />
                )
              )}
            </Box>

            <TextField
              select
              size="small"
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 180 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="price-low-to-high">Price: Low to High</MenuItem>
              <MenuItem value="price-high-to-low">Price: High to Low</MenuItem>
              <MenuItem value="rating-high-to-low">Rating: High to Low</MenuItem>
            </TextField>

            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => {
                setSearchTerm("");
                setCategory("All");
                setSortBy("");
              }}
              startIcon={<RestartAltIcon />}
              sx={{ ml: 2 }}
            >
              Reset
            </Button>
          </>
        )}
      </Box>

      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Filters</Typography>

          <Box sx={{ my: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {["All", "Accessories", "Electronics", "Gadgets", "Shoes"].map(
              (cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  sx={{
                    bgcolor: category === cat ? themes.primary : "transparent",
                    color: category === cat ? themes.text : "inherit",
                    borderColor: category === cat ? themes.primary : undefined,
                    "&:hover": {
                      bgcolor: category === cat ? themes.text : "#f1f1f1",
                      color: category === cat ? themes.primary : "black",
                    },
                  }}
                  variant={category === cat ? "filled" : "outlined"}
                  onClick={() => setCategory(cat)}
                />
              )
            )}
          </Box>

          <TextField
            fullWidth
            select
            size="small"
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="price-low-to-high">Price: Low to High</MenuItem>
            <MenuItem value="price-high-to-low">Price: High to Low</MenuItem>
            <MenuItem value="rating-high-to-low">Rating: High to Low</MenuItem>
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              onClick={() => {
                setSearchTerm("");
                setCategory("All");
                setSortBy("");
              }}
              color="error"
              startIcon={<RestartAltIcon />}
            >
              Reset
            </Button>
            <Button variant="contained" onClick={() => setFilterDrawerOpen(false)}>
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Product Grid */}


      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {(loading ? Array.from(new Array(8)) : filteredProducts).map((product, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={product?.id || index}
            sx={{ display: "flex" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}  // Initial state (invisible and slightly below)
              animate={{ opacity: 1, y: 0 }}    // Final state (fully visible and in position)
              transition={{ duration: 0.5 }}    // Duration of the animation
              whileHover={{
                scale: 1.02, // Slight scale effect for emphasis
                backgroundColor: themes.primary,  // Change background color on hover
                transition: { duration: 0.3 }, // Smooth transition
              }}
            >
              <Box
                sx={{
                  width: isMobile? 300 : 240,
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "center",
                  px: 1,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: themes.background,
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                  }
                }}
              >


                <Box sx={{ position: "relative", width: '100%', height: 180 }}>
                  {product?.discount > 60 && (
                    <Badge
                      badgeContent={`${product.discount}% OFF LIMITED ONLY`}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 20,
                        left: 70,
                        zIndex: 1,
                        "& .MuiBadge-badge": {
                          fontSize: "0.7rem",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          backgroundColor: 'red',
                          color: "white",
                          whiteSpace: "nowrap"
                        },
                      }}
                    />
                  )}

                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={180} />
                  ) : (
                    <Box
                      component="img"
                      src={product?.image}
                      alt={product?.name}
                      sx={{
                        width: '100%',
                        height: 180,
                        objectFit: "contain",
                        backgroundColor: themes.background,
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Box>



                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  noWrap
                  sx={{ mt: 1, width: "100%" }}
                >
                  {product?.name || <Skeleton width="80%" />}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}
                >
                  {product?.brand || <Skeleton width="100%" />}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    px: 1,
                    mt: "auto",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: themes.primary,
                        fontSize: "0.85rem",
                      }}
                    >
                      {product?.price != null ? `₹${product?.price}` : <Skeleton width="50px" />}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {product?.price != null && product?.discount != null ? (
                        <>₹{(product.price - (product.price * product.discount) / 100).toFixed(2)}</>
                      ) : (
                        <Skeleton width="100%" />
                      )}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="error.main"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {product?.discount != null ? `${product.discount}% OFF` : <Skeleton width="60px" />}
                    </Typography>

                  </Box>

                  <Rating
                    value={product?.rating || 0}
                    size="small"
                    readOnly
                    precision={0.5}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "100%",
                    px: 1,
                    mt: 2,
                  }}
                >

                  {(product?.quantity > 0) && (product?.stock === true) ? (
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: themes.primary,
                        color: themes.text,
                        borderColor: themes.primary,
                        "&:hover": {
                          bgcolor: themes.text,
                          color: themes.primary,
                        },
                        textTransform: "none",
                        fontSize: "0.875rem"
                      }}
                      onClick={() => handleCart(product?.id)}
                      disabled={loading}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ background: themes.background }}
                      disabled
                    >
                      Out of Stock
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    fullWidth
                    color="primary"
                    onClick={() => handleViewDetails(product?.id)}
                    disabled={loading}
                    sx={{
                      backgroundColor: themes.text,
                      color: themes.primary,
                      borderColor: themes.primary,
                      "&:hover": {
                        bgcolor: themes.primary,
                        color: themes.text,
                      },
                      textTransform: "none",
                      fontSize: "0.875rem"
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        )
        )}
      </Grid>

      {!loading && filteredProducts.length === 0 && (
        <Typography variant="h6" color="text.secondary" align="center" mt={4}>
          No products found matching your criteria.
        </Typography>
      )}

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
      <Footer />
    </div>
  );
};

export default ProductPage;
