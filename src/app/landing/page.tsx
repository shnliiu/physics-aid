"use client";

import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import SchoolIcon from "@mui/icons-material/School";

export default function LandingPage() {
  const router = useRouter();

  const handleEnter = () => {
    router.push("/auth");
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#0a0e27",
        background: `
          radial-gradient(ellipse 800px 400px at 20% 40%, rgba(100, 180, 255, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 900px 450px at 80% 30%, rgba(100, 200, 255, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse 700px 500px at 50% 60%, rgba(255, 120, 60, 0.35) 0%, transparent 50%),
          radial-gradient(ellipse 800px 400px at 70% 70%, rgba(255, 140, 80, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 600px 350px at 30% 80%, rgba(255, 100, 50, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse at center, #1a1f3a 0%, #0a0e27 100%)
        `,
        backgroundAttachment: "fixed",
      }}
    >

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 4,
        }}
      >
        {/* Title */}
        <Box sx={{ textAlign: "center" }}>
          <SchoolIcon
            sx={{
              fontSize: 80,
              color: "#64b4ff",
              mb: 2,
              filter: "drop-shadow(0 0 30px rgba(100, 180, 255, 0.6))",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "3rem", md: "6rem" },
              color: "white",
              mb: 2,
              letterSpacing: "-0.03em",
            }}
          >
            Physics Study Hub
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 400,
              mb: 4,
            }}
          >
            Master Thermodynamics with AI
          </Typography>
        </Box>

        {/* Enter Button with Glass Effect */}
        <Button
          variant="contained"
          size="large"
          onClick={handleEnter}
          sx={{
            px: 10,
            py: 3,
            fontSize: "1.5rem",
            fontWeight: 600,
            borderRadius: 50,
            background: "rgba(100, 180, 255, 0.2)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            color: "#E0F2FF",
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(100, 180, 255, 0.3)",
              boxShadow: "0 12px 40px rgba(100, 180, 255, 0.4)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Begin Your Journey
        </Button>

        {/* Floating Stats with Glass Effect */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mt: 4,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["2000+ Students", "100% Free", "AI-Powered"].map((stat) => (
            <Box
              key={stat}
              sx={{
                px: 4,
                py: 2,
                borderRadius: 30,
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 8px 30px rgba(100, 180, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#E0F2FF",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                }}
              >
                {stat}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
