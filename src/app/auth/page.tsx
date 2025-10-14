"use client";

import * as React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Fade,
  Slide,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import GoogleIcon from "@mui/icons-material/Google";
import AppleIcon from "@mui/icons-material/Apple";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({
    name: false,
    email: false,
    password: false,
  });
  const [passwordStrength, setPasswordStrength] = React.useState(0);

  // Password strength calculation
  React.useEffect(() => {
    const { password } = formData;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    setErrors({ ...errors, [field]: false });
  };

  const validateForm = () => {
    const newErrors = {
      name: !isLogin && formData.name.trim() === "",
      email: !formData.email.includes("@"),
      password: formData.password.length < 6,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      setLoading(false);
      // Navigate to tutor page (mock success)
      router.push("/tutor");
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Mock social login - just redirect
    setTimeout(() => {
      router.push("/tutor");
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({ name: false, email: false, password: false });
    setFormData({ name: "", email: "", password: "" });
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      {/* Auth Card */}
      <Fade in timeout={800}>
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            zIndex: 10,
            maxWidth: 450,
            width: "90%",
            p: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(66, 165, 245, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Title */}
          <Slide in direction="down" timeout={600}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 1,
                }}
              >
                {isLogin ? "Welcome Back" : "Create Account"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#90caf9" }}>
                {isLogin
                  ? "Sign in to continue your learning journey"
                  : "Join thousands of students mastering physics"}
              </Typography>
            </Box>
          </Slide>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            {!isLogin && (
              <Slide in={!isLogin} direction="right" timeout={400}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  error={errors.name}
                  helperText={errors.name && "Name is required"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(66, 165, 245, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(66, 165, 245, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#42a5f5",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#90caf9",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#42a5f5" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Slide>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
              helperText={errors.email && "Please enter a valid email"}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "rgba(66, 165, 245, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(66, 165, 245, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#42a5f5",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#90caf9",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#42a5f5" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={errors.password}
              helperText={errors.password && "Password must be at least 6 characters"}
              sx={{
                mb: !isLogin ? 1 : 2,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": {
                    borderColor: "rgba(66, 165, 245, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(66, 165, 245, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#42a5f5",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#90caf9",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#42a5f5" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#42a5f5" }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Meter */}
            {!isLogin && formData.password && (
              <Fade in>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "rgba(66, 165, 245, 0.2)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          passwordStrength < 50
                            ? "#f44336"
                            : passwordStrength < 75
                            ? "#ff9800"
                            : "#4caf50",
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: "#90caf9", mt: 0.5, display: "block" }}>
                    Password strength:{" "}
                    {passwordStrength < 50 ? "Weak" : passwordStrength < 75 ? "Medium" : "Strong"}
                  </Typography>
                </Box>
              </Fade>
            )}

            {isLogin && (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <FormControlLabel
                  control={<Checkbox sx={{ color: "#42a5f5" }} />}
                  label={<Typography variant="body2" sx={{ color: "#90caf9" }}>Remember me</Typography>}
                />
                <Button
                  variant="text"
                  sx={{
                    color: "#42a5f5",
                    textTransform: "none",
                    "&:hover": { bgcolor: "rgba(66, 165, 245, 0.1)" },
                  }}
                >
                  Forgot password?
                </Button>
              </Box>
            )}

            {/* Submit Button */}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                boxShadow: "0 0 20px rgba(66, 165, 245, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 25px rgba(66, 165, 245, 0.6)",
                },
                "&:disabled": {
                  background: "rgba(66, 165, 245, 0.3)",
                },
              }}
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ mb: 3, borderColor: "rgba(66, 165, 245, 0.2)" }}>
            <Typography variant="body2" sx={{ color: "#90caf9", px: 2 }}>
              Or continue with
            </Typography>
          </Divider>

          {/* Social Login */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {[
              { icon: <GoogleIcon />, name: "Google" },
              { icon: <AppleIcon />, name: "Apple" },
              { icon: <GitHubIcon />, name: "GitHub" },
            ].map((social) => (
              <Button
                key={social.name}
                fullWidth
                variant="outlined"
                onClick={() => handleSocialLogin(social.name)}
                sx={{
                  py: 1,
                  borderColor: "rgba(66, 165, 245, 0.3)",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#42a5f5",
                    bgcolor: "rgba(66, 165, 245, 0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {social.icon}
              </Button>
            ))}
          </Box>

          {/* Toggle Login/Signup */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#90caf9" }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Button
                variant="text"
                onClick={toggleMode}
                sx={{
                  color: "#42a5f5",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
