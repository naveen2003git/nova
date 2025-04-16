import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Avatar,
  Rating,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSpring, animated } from "react-spring";
import Footer from "../../component/Footer";
import { ThemeContext } from "../../ThemeContext/ThemeContext";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CheckIcon from "@mui/icons-material/Check";
import SecurityIcon from "@mui/icons-material/Security";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportIcon from "@mui/icons-material/Support";
import StarIcon from "@mui/icons-material/Star";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const themes = useContext(ThemeContext);
  const [hovered, setHovered] = useState(null);

  // Enhanced animations
  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 280, friction: 20 },
  });

  const headerAnimation = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    delay: 300,
    config: { tension: 280, friction: 20 },
  });

  // Helper function to stagger animations for sections
  const useStaggeredAnimation = (delay = 0) =>
    useSpring({
      from: { opacity: 0, transform: "translateY(40px)" },
      to: { opacity: 1, transform: "translateY(0px)" },
      delay,
      config: { tension: 280, friction: 20 },
    });

  const introAnimation = useStaggeredAnimation(400);
  const missionAnimation = useStaggeredAnimation(600);
  const whyChooseAnimation = useStaggeredAnimation(800);
  const promiseAnimation = useStaggeredAnimation(1000);
  const storyAnimation = useStaggeredAnimation(1200);
  const testimonialAnimation = useStaggeredAnimation(1400);

  const featureIcons = [
    { icon: <StorefrontIcon fontSize="large" />, color: "#6C63FF" },
    { icon: <LocalShippingIcon fontSize="large" />, color: "#FF6584" },
    { icon: <SecurityIcon fontSize="large" />, color: "#4CAF50" },
    { icon: <SupportIcon fontSize="large" />, color: "#FF9800" },
  ];

  const testimonials = [
    {
      text: "NovaFrames has transformed my online shopping experience. Their products are high-quality and arrive faster than expected!",
      author: "Sarah Wilson",
      rating: 5,
      avatar: "SW",
    },
    {
      text: "The customer service team went above and beyond to help with my order. I'm now a loyal customer for life!",
      author: "John Reynolds",
      rating: 5,
      avatar: "JR",
    },
    {
      text: "I appreciate their commitment to sustainability. It's rare to find an online store that cares so much about its environmental impact.",
      author: "Emily Thompson",
      rating: 4,
      avatar: "ET",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${themes.primary} 0%, #303f9f 100%)`,
          color: "white",
          pt: 10,
          pb: 8,
          borderRadius: { xs: "0 0 0 0", md: "0 0 50% 50%" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background:
              "radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%, transparent 30%, #000 30%, #000 31%, transparent 31%), radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%, transparent 30%, #000 30%, #000 31%, transparent 31%) 50px 50px",
            backgroundSize: "100px 100px",
          }}
        />
        <Container maxWidth="lg">
          <animated.div style={titleAnimation}>
            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "4rem" },
                letterSpacing: "-0.5px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                mb: 1,
              }}
            >
              About NovaFrames
            </Typography>
          </animated.div>

          <animated.div style={headerAnimation}>
            <Typography
              variant="h5"
              align="center"
              sx={{
                fontWeight: 400,
                maxWidth: "800px",
                mx: "auto",
                mb: 5,
                opacity: 0.9,
              }}
            >
              Redefining your online shopping experience since 2025
            </Typography>
          </animated.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 2 }}>
        {/* Introduction Card */}
        <animated.div style={introAnimation}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: "white",
              mb: 8,
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 700, color: themes.primary }}
                >
                  Welcome to NovaFrames
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7, mb: 3 }}
                >
                  We're more than just an online store — we're your trusted
                  partner in discovering products that enhance your life. At
                  NovaFrames, we combine premium selection, exceptional service,
                  and innovative shopping technology to create an experience
                  that's uniquely yours.
                </Typography>
                
                
              </Grid>
            </Grid>
          </Paper>
        </animated.div>

        {/* Our Mission Section */}
        <animated.div style={missionAnimation}>
          <Box sx={{ mb: 8 }}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Chip
                label="OUR MISSION"
                sx={{
                  bgcolor: `${themes.primary}20`,
                  color: themes.primary,
                  fontWeight: "bold",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 700, mb: 1 }}
              >
                What Drives Us Forward
              </Typography>
              <Divider
                sx={{
                  width: "80px",
                  mx: "auto",
                  borderColor: themes.primary,
                  borderWidth: 3,
                  borderRadius: 1,
                  mb: 3,
                }}
              />
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${themes.primary}10 0%, ${themes.primary}20 100%)`,
                border: `1px solid ${themes.primary}30`,
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: themes.primary,
                        width: 100,
                        height: 100,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      }}
                    >
                      <RocketLaunchIcon sx={{ fontSize: 50 }} />
                    </Avatar>
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600, color: themes.primary }}
                  >
                    Revolutionizing E-Commerce
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.05rem", lineHeight: 1.8, mb: 2 }}
                  >
                    At NovaFrames, our mission transcends typical online retail.
                    We're committed to creating a shopping ecosystem that's
                    intuitive, personalized, and socially responsible.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.05rem", lineHeight: 1.8 }}
                  >
                    We meticulously curate products that meet our rigorous
                    standards for quality, design, and sustainability, ensuring
                    that every purchase enriches your life while minimizing
                    environmental impact.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </animated.div>

        {/* Why Choose Us */}
        <animated.div style={whyChooseAnimation}>
          <Box sx={{ mb: 10 }}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Chip
                label="WHY CHOOSE US"
                sx={{
                  bgcolor: `${themes.primary}20`,
                  color: themes.primary,
                  fontWeight: "bold",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 700, mb: 1 }}
              >
                The NovaFrames Difference
              </Typography>
              <Divider
                sx={{
                  width: "80px",
                  mx: "auto",
                  borderColor: themes.primary,
                  borderWidth: 3,
                  borderRadius: 1,
                  mb: 3,
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  maxWidth: "800px",
                  mx: "auto",
                  color: "text.secondary",
                  mb: 5,
                }}
              >
                Discover what sets us apart from other online retailers and why
                thousands of customers choose us daily.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {[
                {
                  title: "Premium Selection",
                  description:
                    "Rigorously vetted products that meet our high standards for quality, design, and functionality.",
                  icon: <CheckIcon fontSize="large" />,
                  color: "#6C63FF",
                },
                {
                  title: "Fast & Secure Delivery",
                  description:
                    "Expedited shipping options with real-time tracking and secure packaging for all orders.",
                  icon: <LocalShippingIcon fontSize="large" />,
                  color: "#FF6584",
                },
                {
                  title: "Guaranteed Security",
                  description:
                    "State-of-the-art encryption for all transactions with multiple payment options for your convenience.",
                  icon: <SecurityIcon fontSize="large" />,
                  color: "#4CAF50",
                },
                {
                  title: "24/7 Support",
                  description:
                    "Our dedicated team is always available to assist you with inquiries, returns, or technical issues.",
                  icon: <SupportIcon fontSize="large" />,
                  color: "#FF9800",
                },
              ].map((feature, index) => (
                <Grid  key={index}>
                  <Card
                    elevation={3}
                    sx={{
                      height: "100%",
                      width:isMobile?'350px':'270px',
                      borderRadius: 3,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                      },
                    }}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        p: 3,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: `${feature.color}15`,
                          width: 70,
                          height: 70,
                          mb: 2,
                          color: feature.color,
                          transform: hovered === index ? "scale(1.1)" : "scale(1)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </animated.div>

        {/* Our Promise */}
        <animated.div style={promiseAnimation}>
          <Paper
            elevation={4}
            sx={{
              mb: 10,
              borderRadius: 4,
              background: `linear-gradient(135deg, #303f9f 0%, ${themes.primary} 100%)`,
              color: "white",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                background:
                  "radial-gradient(circle at 25% 40%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%), radial-gradient(circle at 75% 60%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%)",
              }}
            />
            <Grid container>
              <Grid item xs={12} md={8} sx={{ position: "relative", zIndex: 2 }}>
                <Box sx={{ p: { xs: 4, md: 6 } }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 3 }}
                  >
                    Our Promise to You
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.1rem", lineHeight: 1.7, mb: 4 }}
                  >
                    We believe in transparent, ethical, and sustainable business
                    practices. Our commitment to you goes beyond just selling
                    products – we're building a community based on trust,
                    quality, and exceptional service.
                  </Typography>
                  <Grid container spacing={3}>
                    {[
                      "100% satisfaction guarantee",
                      "Ethical sourcing practices",
                      "Eco-friendly packaging",
                      "Community support initiatives",
                      "Transparent pricing policy",
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CheckIcon
                            sx={{ mr: 1, color: "rgba(255,255,255,0.9)" }}
                          />
                          <Typography
                            variant="body1"
                            sx={{ opacity: 0.9 }}
                          >
                            {item}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    right: -50,
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 100, opacity: 0.8 }} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </animated.div>

        {/* Our Story */}
        <animated.div style={storyAnimation}>
          <Box sx={{ mb: 10 }}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Chip
                label="OUR STORY"
                sx={{
                  bgcolor: `${themes.primary}20`,
                  color: themes.primary,
                  fontWeight: "bold",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 700, mb: 1 }}
              >
                How We Started
              </Typography>
              <Divider
                sx={{
                  width: "80px",
                  mx: "auto",
                  borderColor: themes.primary,
                  borderWidth: 3,
                  borderRadius: 1,
                  mb: 3,
                }}
              />
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, ${themes.primary}08 0%, ${themes.primary}15 100%)`,
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: { xs: 3, md: 0 },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: themes.primary,
                          width: 120,
                          height: 120,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                        }}
                      >
                        <HistoryEduIcon sx={{ fontSize: 60 }} />
                      </Avatar>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: themes.primary,
                        mb: 2,
                      }}
                    >
                      From Vision to Reality
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1.05rem",
                        lineHeight: 1.8,
                        mb: 3,
                      }}
                    >
                      Founded in 2025 by a team of e-commerce enthusiasts,
                      NovaFrames began with a simple yet ambitious goal: to
                      transform online shopping from a mere transaction into an
                      experience worth remembering.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1.05rem",
                        lineHeight: 1.8,
                      }}
                    >
                      What started as a small operation with just three team
                      members and fifty products has now grown into a thriving
                      marketplace with thousands of carefully selected items and
                      a dedicated team committed to excellence. Through
                      innovation, persistence, and an unwavering focus on
                      customer satisfaction, we've built a platform that
                      redefines what online shopping can be.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </animated.div>

        {/* Testimonials */}
        <animated.div style={testimonialAnimation}>
          <Box sx={{ mb: 10 }}>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Chip
                label="TESTIMONIALS"
                sx={{
                  bgcolor: `${themes.primary}20`,
                  color: themes.primary,
                  fontWeight: "bold",
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 700, mb: 1 }}
              >
                What Our Customers Say
              </Typography>
              <Divider
                sx={{
                  width: "80px",
                  mx: "auto",
                  borderColor: themes.primary,
                  borderWidth: 3,
                  borderRadius: 1,
                  mb: 3,
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  color: "text.secondary",
                  mb: 5,
                }}
              >
                Don't just take our word for it. Here's what our community has to
                say about their NovaFrames experience.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {testimonials.map((testimonial, index) => (
                <Grid key={index}>
                  <Card
                    elevation={4}
                    sx={{
                      height: "100%",
                      width:isMobile ? '350px' : '360px',
                      borderRadius: 3,
                      position: "relative",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      overflow: "visible",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 16px 30px rgba(0,0,0,0.1)",
                      },
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: -10,
                        left: 20,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: themes.primary,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1,
                      },
                    }}
                  >
                    <FormatQuoteIcon
                      sx={{
                        position: "absolute",
                        top: -8,
                        left: 27,
                        color: "white",
                        fontSize: 16,
                        zIndex: 2,
                      }}
                    />
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: themes.primary,
                              width: 40,
                              height: 40,
                              mr: 2,
                            }}
                          >
                            {testimonial.avatar}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {testimonial.author}
                          </Typography>
                        </Box>
                        <Rating
                          value={testimonial.rating}
                          readOnly
                          size="small"
                          icon={<StarIcon fontSize="inherit" />}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </animated.div>

        {/* CTA Section */}
        <Box sx={{ my: 10, textAlign: "center" }}>
          <Paper
            elevation={4}
            sx={{
              py: 8,
              px: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${themes.primary} 0%, #303f9f 100%)`,
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-55 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              }}
            />
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: 700, mb: 3 }}
            >
              Ready to Transform Your Shopping Experience?
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 400, maxWidth: "700px", mx: "auto", mb: 5, opacity: 0.9 }}
            >
              Join thousands of satisfied customers who have discovered the NovaFrames difference.
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/"
              sx={{
                bgcolor: "white",
                color: themes.primary,
                px: 5,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                "&:hover": {
                  bgcolor: "white",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Start Shopping Now
            </Button>
          </Paper>
        </Box>

        {/* Stats Section */}
        <Box sx={{ mb: 12 }}>
          <Grid container spacing={4}>
            {[
              { number: "10K+", label: "Products" },
              { number: "50K+", label: "Happy Customers" },
              { number: "99%", label: "Satisfaction Rate" },
              { number: "24/7", label: "Customer Support" },
            ].map((stat, index) => (
              <Grid key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: "center",
                    height: "100px",
                    width: isMobile ? '300px' : '216px',
                    
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      bgcolor: `${themes.primary}05`,
                    },
                  }}
                >
                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{ fontWeight: 700, color: themes.primary }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;