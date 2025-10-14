"use client";

import * as React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";

interface HeatMark {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export default function LandingPage() {
  const router = useRouter();
  const [showContent, setShowContent] = React.useState(false);
  const [heatMarks, setHeatMarks] = React.useState<HeatMark[]>([]);

  // Mouse position with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations for mouse following
  const springConfig = { damping: 25, stiffness: 100 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  React.useEffect(() => {
    setShowContent(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    // Add heat mark
    const newMark: HeatMark = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now(),
    };

    setHeatMarks((prev) => [...prev, newMark]);

    // Remove heat mark after 800ms
    setTimeout(() => {
      setHeatMarks((prev) => prev.filter((mark) => mark.id !== newMark.id));
    }, 800);
  };

  const handleEnter = () => {
    router.push("/auth");
  };

  // Create subtle particles for glass effect
  const molecules = React.useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 60 + 30,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 8,
      color: i % 3 === 0 ? 'rgba(180, 190, 210,' : i % 3 === 1 ? 'rgba(160, 180, 220,' : 'rgba(200, 210, 230,',
    }));
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f5f7",
        background: "linear-gradient(135deg, #e8e9f0 0%, #f0f1f5 50%, #e5e6eb 100%)",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Gas Flow Background - subtle particles */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {molecules.map((molecule) => (
          <GasMolecule
            key={molecule.id}
            molecule={molecule}
            mouseX={x}
            mouseY={y}
          />
        ))}
      </Box>

      {/* Heat marks */}
      {heatMarks.map((mark) => (
        <motion.div
          key={mark.id}
          style={{
            position: "absolute",
            left: mark.x - 50,
            top: mark.y - 50,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 100, 50, 0.4) 0%, rgba(255, 150, 100, 0.2) 30%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      {/* Frosted glass overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(60px) saturate(180%)",
          WebkitBackdropFilter: "blur(60px) saturate(180%)",
          background: "rgba(255, 255, 255, 0.25)",
          pointerEvents: "none",
        }}
      />

      {/* Animated gradient orbs - softer for glass effect */}
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30, 144, 255, 0.12) 0%, transparent 70%)",
          filter: "blur(110px)",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

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
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Box sx={{ textAlign: "center" }}>
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SchoolIcon
                sx={{
                  fontSize: 80,
                  color: "#42a5f5",
                  mb: 2,
                  filter: "drop-shadow(0 0 30px rgba(66, 165, 245, 0.6))",
                }}
              />
            </motion.div>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "3rem", md: "6rem" },
                background: "linear-gradient(135deg, #1d1d1f 0%, #2d2d2f 50%, #1d1d1f 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 2,
                letterSpacing: "-0.03em",
                position: "relative",
              }}
            >
              Physics Study Hub
            </Typography>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#6e6e73",
                  fontWeight: 400,
                  mb: 4,
                }}
              >
                Master Thermodynamics with AI
              </Typography>
            </motion.div>
          </Box>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: showContent ? 1 : 0,
            scale: showContent ? 1 : 0.8,
          }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
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
              background: "#0071e3",
              boxShadow: "0 4px 20px rgba(0, 113, 227, 0.25)",
              border: "none",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s ease",
              color: "white",
              textTransform: "none",
              backdropFilter: "blur(20px)",
              "&:hover": {
                background: "#0077ed",
                boxShadow: "0 8px 30px rgba(0, 113, 227, 0.35)",
                transform: "translateY(-2px)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
            }}
          >
            Begin Your Journey
          </Button>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mt: 4,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["2000+ Students", "100% Free", "AI-Powered"].map((stat, idx) => (
              <motion.div
                key={stat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + idx * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <Box
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: 30,
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(30px) saturate(180%)",
                    WebkitBackdropFilter: "blur(30px) saturate(180%)",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.75)",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1d1d1f",
                      fontWeight: 600,
                      fontSize: "1.05rem",
                    }}
                  >
                    {stat}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

// Gas Molecule Component - Simulates flowing gas particles
interface GasMoleculeProps {
  molecule: {
    id: number;
    initialX: number;
    initialY: number;
    size: number;
    duration: number;
    delay: number;
    color: string;
  };
  mouseX: any;
  mouseY: any;
}

function GasMolecule({ molecule, mouseX, mouseY }: GasMoleculeProps) {
  // Transform mouse position to particle displacement
  const offsetX = useTransform(
    mouseX,
    [0, typeof window !== 'undefined' ? window.innerWidth : 1920],
    [-40, 40]
  );
  const offsetY = useTransform(
    mouseY,
    [0, typeof window !== 'undefined' ? window.innerHeight : 1080],
    [-40, 40]
  );

  return (
    <motion.div
      suppressHydrationWarning
      style={{
        position: "absolute",
        left: `${molecule.initialX}%`,
        top: `${molecule.initialY}%`,
        width: molecule.size,
        height: molecule.size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${molecule.color} 0.15) 0%, ${molecule.color} 0.05) 50%, transparent 100%)`,
        filter: "blur(40px)",
        x: offsetX,
        y: offsetY,
      }}
      animate={{
        x: [0, 30, -20, 40, -10, 0],
        y: [0, -40, 30, -20, 35, 0],
        scale: [1, 1.2, 0.8, 1.1, 0.9, 1],
        opacity: [0.2, 0.35, 0.15, 0.3, 0.2, 0.2],
      }}
      transition={{
        duration: molecule.duration,
        delay: molecule.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
