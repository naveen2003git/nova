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

const TermsOfService = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
      ],
    },
    {
      title: '2. Changes to Terms',
      content: [
        'We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes your acceptance of the new terms.',
      ],
    },
    {
      title: '3. Account Responsibilities',
      content: [
        'You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.',
      ],
    },
    {
      title: '4. Prohibited Activities',
      content: [
        'You agree not to use the site for any unlawful or prohibited activities including spamming, hacking, or infringing on intellectual property rights.',
      ],
    },
    {
      title: '5. Intellectual Property',
      content: [
        'All content, logos, and trademarks on this site are the property of our company or its licensors and may not be used without permission.',
      ],
    },
    {
      title: '6. Termination',
      content: [
        'We may terminate or suspend access to our services immediately, without prior notice, if you violate these Terms.',
      ],
    },
    {
      title: '7. Disclaimer of Warranties',
      content: [
        'Our services are provided "as is" and we make no warranties of any kind regarding the website or its content.',
      ],
    },
    {
      title: '8. Limitation of Liability',
      content: [
        'We shall not be liable for any damages resulting from the use or inability to use the site or its content.',
      ],
    },
    {
      title: '9. Governing Law',
      content: [
        'These Terms shall be governed by and construed in accordance with the laws of your local jurisdiction.',
      ],
    },
    {
      title: '10. Contact Us',
      content: [
        'If you have any questions about these Terms, please contact us at support@example.com.',
      ],
    },
  ];

  return (
    <Box sx={{ padding: 4,margin: 'auto' }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariant}
        custom={0}
      >
        <Typography variant="h4" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body1" paragraph>
          These Terms of Service ("Terms") govern your use of our website and services. Please read them carefully before proceeding.
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

export default TermsOfService;
