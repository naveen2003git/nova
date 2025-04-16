import React from 'react';
import { Box, Typography } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Footer from './Footer';

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const PrivacyPolicy = () => {
  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal Information: Name, email address, shipping address, billing information, etc.',
        'Device Information: IP address, browser type, operating system, etc.',
        'Order Information: Items purchased, payment method, purchase history.',
        'Cookies and Tracking Technologies: To improve user experience and analyze site performance.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'Process transactions and fulfill orders',
        'Communicate with you about your order or account',
        'Improve our products and services',
        'Send marketing communications (with your consent)',
      ],
    },
    {
      title: '3. Sharing Your Information',
      content: [
        'Third-party service providers for payment processing, shipping, analytics, etc.',
        'Legal authorities when required by law',
        'Marketing partners, with your consent',
      ],
    },
    {
      title: '4. Cookies',
      content: [
        'We use cookies and similar technologies to personalize your experience, analyze traffic, and serve targeted advertisements.',
        'You can manage your cookie preferences through your browser settings.',
      ],
    },
    {
      title: '5. Data Security',
      content: [
        'We implement security measures to protect your personal data.',
        'However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      title: '6. Your Rights',
      content: [
        'Depending on your location, you may have rights such as accessing, correcting, or deleting your personal information.',
        'You can contact us at [support@example.com] for any requests.',
      ],
    },
    {
      title: '7. Changes to This Policy',
      content: [
        'We may update this Privacy Policy from time to time.',
        'Any changes will be posted on this page with the updated effective date.',
      ],
    },
    {
      title: '8. Contact Us',
      content: [
        'If you have any questions about this Privacy Policy, please contact us at support@example.com.',
      ],
    },
  ];

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
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          This Privacy Policy describes how we collect, use, and disclose your personal information when you visit or make a purchase from our website.
        </Typography>
      </motion.div>

      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariant}
          custom={index + 1}
          style={{ marginTop: '32px' }}
        >
          <Typography variant="h5" gutterBottom>
            {section.title}
          </Typography>
          {section.content.map((item, i) => (
            <Typography key={i} variant="body1" paragraph>
              {item}
            </Typography>
          ))}
        </motion.div>
      ))}
      <Footer />
    </Box>
  );
};

export default PrivacyPolicy;
