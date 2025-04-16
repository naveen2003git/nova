import { useState } from 'react';
import { 
  Box, Typography, Chip, Checkbox, IconButton, 
  Card, Grid, Tooltip, Badge
} from '@mui/material';
import { 
  DeleteOutlined, AddCircleOutlined, RemoveCircleOutlined, 
  CheckCircleOutline, LocalShippingOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProductCard = ({ item, i, handleCheckboxChange, handleQuantityChange, handleRemoveItem, isOutOfStock, stock, themes }) => {
  // Calculate discounted price
  const discountedPrice = item.price - (item.price * item.discount / 100);
  const totalItemPrice = discountedPrice * item.quantity;

  // Hover state for the card
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        delay: i * 0.08 
      }}
    >
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          mb: 3,
          overflow: 'hidden',
          position: 'relative',
          opacity: isOutOfStock || stock ? 0.5 : 1,
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          borderRadius: 4,
          boxShadow: isHovered ? '0 15px 30px rgba(0,0,0,0.1)' : '0 5px 15px rgba(0,0,0,0.05)',
          background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
          border: '1px solid',
          borderColor: isHovered ? (themes.primary || '#4a6fa5') + '50' : 'transparent',
        }}
      >
        {/* Discount badge */}
        {item.discount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              backgroundColor: themes.primary || '#4a6fa5',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '20px',
              fontWeight: 'bold',
              zIndex: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {item.discount}% OFF
            </Typography>
          </Box>
        )}
        
        <Grid container spacing={0}>
          {/* Product Image */}
          <Grid item xs={12} sm={4} md={3}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
                position: 'relative',
                overflow: 'hidden',
                background: themes.background || '#f0f4f8',
                borderRight: '1px dashed',
                borderColor: isHovered ? (themes.primary || '#4a6fa5') + '30' : '#eee',
              }}
            >
              <motion.img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '140px',
                  objectFit: 'contain',
                  filter: isOutOfStock || stock ? 'grayscale(0.5)' : 'none',
                }}
                animate={{ 
                  rotate: isHovered ? 5 : 0,
                  scale: isHovered ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 200 }}
              />
            </Box>
          </Grid>
          
          {/* Product Details */}
          <Grid item xs={12} sm={8} md={9}>
            <Box sx={{ p: 3 }}>
              <Grid container>
                {/* Left section - name, description, stock status */}
                <Grid item xs={12} md={7}>
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ 
                      color: themes.primary || '#4a6fa5',
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      transition: 'color 0.3s ease',
                      '&:hover': { color: themes.secondary || '#f58a07' }
                    }}
                  >
                    {item.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.description}
                  </Typography>
                  
                  {/* Stock status */}
                  {(isOutOfStock || stock) ? (
                    <Chip 
                      label="Out of Stock" 
                      size="small" 
                      sx={{ 
                        mb: 1,
                        bgcolor: '#ffeaea',
                        color: '#d32f2f',
                        border: '1px solid #ffd5d5',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  ) : (
                    <Chip 
                      icon={<CheckCircleOutline fontSize="small" />}
                      label="In Stock"
                      size="small"
                      sx={{ 
                        mb: 1,
                        bgcolor: '#e8f5e9',
                        color: '#2e7d32',
                        border: '1px solid #c8e6c9',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                  
                  {/* Select checkbox with animated label */}
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={item.selected}
                      onChange={e => handleCheckboxChange(item.id, e.target.checked)}
                      disabled={isOutOfStock || stock}
                      sx={{
                        color: (themes.primary || '#4a6fa5') + '80',
                        '&.Mui-checked': {
                          color: themes.primary || '#4a6fa5',
                        },
                        transform: 'scale(1.2)',
                        ml: 1,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: item.selected ? 'bold' : 'normal',
                        color: item.selected ? (themes.primary || '#4a6fa5') : 'text.secondary',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {item.selected ? 'Selected' : 'Select item'}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Right section - pricing and actions */}
                <Grid item xs={12} md={5}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: {xs: 'flex-start', md: 'flex-end'}, 
                    height: '100%', 
                    justifyContent: 'space-between' 
                  }}>
                    {/* Price section */}
                    <Box sx={{ 
                      textAlign: {xs: 'left', md: 'right'},
                      background: isHovered ? 'rgba(250, 250, 250, 0.8)' : 'transparent',
                      p: 1,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                    }}>
                      {item.discount > 0 && (
                        <Typography 
                          sx={{ 
                            textDecoration: 'line-through', 
                            color: 'text.secondary',
                            fontSize: '0.9rem'
                          }}
                        >
                          ₹{item.price}
                        </Typography>
                      )}
                      
                      <Typography 
                        variant="h5" 
                        fontWeight="bold" 
                        sx={{ 
                          mb: 0.5,
                          color: themes.secondary || '#f58a07',
                          fontSize: { xs: '1.4rem', sm: '1.8rem' },
                        }}
                      >
                        ₹{discountedPrice.toFixed(2)}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: 'text.secondary',
                          fontStyle: 'italic'
                        }}
                      >
                        Subtotal: ₹{totalItemPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    {/* Quantity controls */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: 3, 
                      mb: {xs: 2, md: 0},
                      justifyContent: {xs: 'flex-start', md: 'flex-end'},
                      width: '100%'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        backgroundColor: '#f5f7fa',
                        borderRadius: '30px',
                        mr: 2,
                        border: '1px solid',
                        borderColor: isHovered ? (themes.primary || '#4a6fa5') + '50' : '#e0e0e0',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                      }}>
                        <IconButton 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={isOutOfStock || stock || item.quantity === 1}
                          size="small"
                          sx={{ 
                            color: themes.primary || '#4a6fa5',
                            '&.Mui-disabled': {
                              color: 'rgba(0, 0, 0, 0.26)',
                            }
                          }}
                        >
                          <RemoveCircleOutlined fontSize="small" />
                        </IconButton>
                        
                        <Typography 
                          sx={{ 
                            px: 2,
                            fontWeight: 'bold',
                            color: themes.primary || '#4a6fa5'
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        
                        <IconButton 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          disabled={isOutOfStock || stock}
                          size="small"
                          sx={{ 
                            color: themes.primary || '#4a6fa5',
                            '&.Mui-disabled': {
                              color: 'rgba(0, 0, 0, 0.26)',
                            }
                          }}
                        >
                          <AddCircleOutlined fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      {/* Remove button */}
                      <Tooltip title="Remove item">
                        <IconButton 
                          onClick={() => handleRemoveItem(item.id)}
                          sx={{ 
                            color: '#d32f2f',
                            border: '1px solid rgba(211, 47, 47, 0.3)',
                            borderRadius: '50%',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              backgroundColor: 'rgba(211, 47, 47, 0.08)',
                              transform: 'rotate(90deg)',
                            }
                          }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* Free shipping indicator */}
        {discountedPrice > 500 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              display: 'flex',
              alignItems: 'center',
              color: themes.primary || '#4a6fa5',
              opacity: 0.8,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 1
              }
            }}
          >
            <LocalShippingOutlined fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" fontWeight="medium">
              Free Shipping
            </Typography>
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;