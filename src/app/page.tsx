import * as React from "react";
import { Box, Typography, Paper, Button, Card, CardContent } from "@mui/material";
import Link from "next/link";
import SchoolIcon from "@mui/icons-material/School";

export default function Home() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Physics Aid
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Your AI-powered tutor for Heat and Thermodynamics
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Get Started
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/tutor"
            startIcon={<SchoolIcon />}
          >
            Start Learning
          </Button>
        </Box>
      </Paper>

      {/* Features */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Topics Covered
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">• Temperature and Heat</Typography>
                <Typography variant="body2">• Thermodynamic Systems</Typography>
                <Typography variant="body2">• Laws of Thermodynamics</Typography>
                <Typography variant="body2">• Entropy and Energy</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                How It Works
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">1. Ask any physics question</Typography>
                <Typography variant="body2">2. Get AI-powered explanations</Typography>
                <Typography variant="body2">3. Learn from OpenStax textbooks</Typography>
                <Typography variant="body2">4. Practice problem-solving</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* About */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          border: '1px solid',
          borderColor: 'primary.light',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          About Physics Aid
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Physics Aid uses AI technology trained on OpenStax University Physics textbooks to help students
          master heat and thermodynamics concepts. Get instant answers, detailed explanations, and
          personalized guidance for your physics studies.
        </Typography>
      </Paper>
    </Box>
  );
}