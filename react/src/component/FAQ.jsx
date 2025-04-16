import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Footer from './Footer';

const sectionVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const faqs = [
  {
    question: 'How do I place an order?',
    answer:
      'Browse our products, add items to your cart, and proceed to checkout. You will need to provide shipping and payment details to complete the purchase.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept major credit/debit cards, UPI, PayPal, and other secure payment options.',
  },
  {
    question: 'How long will delivery take?',
    answer:
      'Delivery typically takes 3–7 business days, depending on your location and shipping option selected at checkout.',
  },
  {
    question: 'Can I return or exchange a product?',
    answer:
      'Yes, we have a 7-day return/exchange policy. Products must be unused and in original packaging. Visit our Returns page for details.',
  },
  {
    question: 'How do I track my order?',
    answer:
      'Once your order ships, you’ll receive a tracking link via email or SMS. You can also check order status in your account dashboard.',
  },
];

const FAQ = () => {
  return (
    <Box sx={{ padding: 4, margin: 'auto' }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        custom={0}
      >
        <Typography variant="h4" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" paragraph>
          Need help? Check out some of the most commonly asked questions below.
        </Typography>
      </motion.div>

      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
          custom={index + 1}
          style={{ marginTop: '16px' }}
        >
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}

      <Footer/>
    </Box>
  );
};

export default FAQ;
