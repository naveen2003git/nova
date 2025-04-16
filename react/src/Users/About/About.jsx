import React, { useContext } from "react";
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
} from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { useSpring, animated } from "react-spring";
import Footer from "../../component/Footer";
import { ThemeContext } from "../../Admin/ThemeContext/ThemeContext";

const About = () => {
  // Title animation
  const titleAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(30px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { duration: 600 },
  });

  // Helper function to stagger animations for sections
  const useStaggeredAnimation = (delay = 0) =>
    useSpring({
      from: { opacity: 0, transform: "translateY(30px)" },
      to: { opacity: 1, transform: "translateY(0px)" },
      delay,
      config: { duration: 600 },
    });

  const introAnimation = useStaggeredAnimation(300);
  const missionAnimation = useStaggeredAnimation(600);
  const whyChooseAnimation = useStaggeredAnimation(800);
  const promiseAnimation = useStaggeredAnimation(1000);
  const storyAnimation = useStaggeredAnimation(1200);
  const testimonialAnimation = useStaggeredAnimation(1400);
  
  // Add fade-in animation for the "What Our Customers Say" Box
  const testimonialBoxAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1500,
    config: { duration: 600 },
  });

  // Add fade-in animation for the "Start Shopping Now" button
  const ctaButtonAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1800,
    config: { duration: 600 },
  });

  const themes = useContext(ThemeContext);

  return (
    <Container  sx={{ py: 8 }}>
      {/* Title */}
      <animated.div style={titleAnimation}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", fontSize: "3rem" }}
        >
          About Us
        </Typography>
      </animated.div>

      {/* Intro */}
      <animated.div style={introAnimation}>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Welcome to <strong>NovaFrames</strong>, your one-stop destination for everything you need. We’re passionate about delivering high-quality products with exceptional service, making sure you have the best online shopping experience.
        </Typography>
      </animated.div>

      {/* Mission & Why Choose Us */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <animated.div style={missionAnimation}>
            <Typography variant="h5" gutterBottom>
              Our Mission
            </Typography>
            <Typography color="text.secondary" paragraph>
              At <strong>NovaFrames</strong>, our mission is to make shopping effortless, affordable, and enjoyable. We bring you the best in fashion, electronics, home goods, and lifestyle essentials, carefully curated with a focus on quality, variety, and style.
            </Typography>
          </animated.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <animated.div style={whyChooseAnimation}>
            <Typography variant="h5" gutterBottom>
              Why Choose Us?
            </Typography>
            <List dense>
              {[
                "Wide range of high-quality, handpicked products",
                "Fast and secure checkout with multiple payment options",
                "Reliable shipping & easy returns within 30 days",
                "24/7 customer support with real-time assistance",
                "Exclusive offers and loyalty rewards for our customers",
              ].map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText primary={`• ${item}`} />
                </ListItem>
              ))}
            </List>
          </animated.div>
        </Grid>
      </Grid>

      {/* Promise */}
      <Box sx={{ mt: 6 }}>
        <animated.div style={promiseAnimation}>
          <Typography variant="h5" gutterBottom>
            Our Promise to You
          </Typography>
          <Typography color="text.secondary" paragraph>
            At <strong>NovaFrames</strong>, we prioritize customer satisfaction, offering secure transactions, quick shipping, and hassle-free returns. We also support sustainability and ethical practices, ensuring that our products meet high-quality standards.
          </Typography>
        </animated.div>
      </Box>

      {/* Story */}
      <Box sx={{ mt: 6 }}>
        <animated.div style={storyAnimation}>
          <Typography variant="h5" gutterBottom>
            Our Story
          </Typography>
          <Typography color="text.secondary" paragraph>
            Founded in 2025, <strong>NovaFrames</strong> started as a small team with a big dream—to revolutionize the way people shop online. With a user-first approach, we've grown into a trusted platform for thousands of customers across the country.
          </Typography>
          {/* <img src={aboutImage} alt="Our Story" style={{ width: '100%', borderRadius: '8px', marginTop: '2rem' }} /> */}
        </animated.div>
      </Box>

      {/* Testimonials */}
      <animated.div style={testimonialBoxAnimation}>
        <Box sx={{ mt: 10, py: 6, px: 2, bgcolor: '#f9f9f9', borderRadius: 3 }}>
          <animated.div style={testimonialAnimation}>
            <Typography variant="h5" gutterBottom align="center">
              What Our Customers Say
            </Typography>
          </animated.div>
          <Grid container spacing={2} justifyContent="center">
            {[
              "Our go-to site for everything. Products always arrive on time, and the customer service is amazing! - Sarah W.",
              "We love NovaFrames! The shopping experience is smooth, and the quality of the products is exceptional! - John R.",
              "The best online shopping experience I've had! Easy returns and fast shipping. Highly recommend! - Emily T.",
            ].map((testimonial, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    boxShadow: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                >
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      "{testimonial}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </animated.div>

      {/* CTA Button */}
      <animated.div style={ctaButtonAnimation}>
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            href="/"
            sx={{
              backgroundColor:themes.primary,
              transition: 'background-color 0.3s ease',
            }}
          >
            Start Shopping Now
          </Button>
        </Box>
      </animated.div>

      <Footer />
    </Container>
  );
};

export default About;
