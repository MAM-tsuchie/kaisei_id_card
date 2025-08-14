import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function Home(): JSX.Element {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          開星デジタル学生証 管理画面
        </Typography>
        <Typography variant="body1">
          Phase 0: Next.js環境構築完了
        </Typography>
      </Box>
    </Container>
  );
}