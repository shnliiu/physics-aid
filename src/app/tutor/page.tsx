"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  InputAdornment,
  Fade,
  Grow,
  Slide,
  Zoom,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import CalculateIcon from "@mui/icons-material/Calculate";
import StyleIcon from "@mui/icons-material/Style";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoutIcon from "@mui/icons-material/Logout";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import WarningIcon from "@mui/icons-material/Warning";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ReactMarkdown from "react-markdown";
import { chapters, practiceProblems, flashcards, volume1Chapters, volume3Chapters } from "@/data/physicsContent";
import { useRouter } from "next/navigation";

// Volume/Chapter structure for sidebar
// NOTE: In real implementation, fetch actual chapter count from database
// For now, showing available chapters from physicsContent.ts (currently 4 chapters)
const volumeStructure = [
  {
    id: 'VOL1',
    title: 'Volume 1: Mechanics',
    chapters: volume1Chapters.map(ch => ch.id) // Volume 1 chapters (1-14)
  },
  {
    id: 'VOL2',
    title: 'Volume 2: Thermodynamics',
    chapters: chapters.filter(ch => ch.id <= 4).map(ch => ch.id) // Volume 2 chapters (1-4 only)
  },
  {
    id: 'VOL3',
    title: 'Volume 3: Optics & Modern',
    chapters: volume3Chapters.map(ch => ch.id) // Volume 3 chapters (1-4)
  }
];

// Helper function to render formulas with proper subscripts and superscripts
function FormulaText({ formula }: { formula: string }) {
  const renderFormula = (text: string) => {
    const parts = [];
    let currentText = '';
    let i = 0;

    while (i < text.length) {
      // Check for subscript pattern: _X or _{...}
      if (text[i] === '_') {
        if (currentText) {
          parts.push(<span key={parts.length}>{currentText}</span>);
          currentText = '';
        }
        if (text[i + 1] === '{') {
          const endBrace = text.indexOf('}', i + 2);
          if (endBrace !== -1) {
            const subscript = text.substring(i + 2, endBrace);
            parts.push(<sub key={parts.length}>{subscript}</sub>);
            i = endBrace + 1;
            continue;
          }
        } else if (i + 1 < text.length) {
          parts.push(<sub key={parts.length}>{text[i + 1]}</sub>);
          i += 2;
          continue;
        }
      }
      // Check for superscript pattern: ^X or ^{...}
      else if (text[i] === '^') {
        if (currentText) {
          parts.push(<span key={parts.length}>{currentText}</span>);
          currentText = '';
        }
        if (text[i + 1] === '{') {
          const endBrace = text.indexOf('}', i + 2);
          if (endBrace !== -1) {
            const superscript = text.substring(i + 2, endBrace);
            parts.push(<sup key={parts.length}>{superscript}</sup>);
            i = endBrace + 1;
            continue;
          }
        } else if (i + 1 < text.length) {
          parts.push(<sup key={parts.length}>{text[i + 1]}</sup>);
          i += 2;
          continue;
        }
      }
      currentText += text[i];
      i++;
    }

    if (currentText) {
      parts.push(<span key={parts.length}>{currentText}</span>);
    }

    return parts;
  };

  return <span style={{ fontSize: '1.1em' }}>{renderFormula(formula)}</span>;
}

export default function PhysicsStudyHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedChapter, setSelectedChapter] = React.useState<number | null>(null);
  const [selectedVolume, setSelectedVolume] = React.useState<'VOL1' | 'VOL2' | 'VOL3'>('VOL1'); // Track which volume is selected
  const [showSolution, setShowSolution] = React.useState<number | null>(null);
  const [currentFlashcard, setCurrentFlashcard] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [tutorInput, setTutorInput] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'assistant', content: string, usedTextbook?: boolean, warning?: string}>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [expandedVolumes, setExpandedVolumes] = React.useState<string[]>(['VOL1', 'VOL2', 'VOL3']);
  const [suggestedQuestions, setSuggestedQuestions] = React.useState<string[]>([
    "Explain the first law of thermodynamics",
    "What's the difference between heat and temperature?",
    "Help me solve a calorimetry problem",
    "How does entropy relate to disorder?"
  ]);

  const handleSignOut = () => {
    router.push("/landing");
  };

  const toggleVolume = (volumeId: string) => {
    setExpandedVolumes(prev =>
      prev.includes(volumeId)
        ? prev.filter(id => id !== volumeId)
        : [...prev, volumeId]
    );
  };

  React.useEffect(() => {
    console.log("Physics Study Hub loaded successfully!");
    console.log("Search query:", searchQuery);
    console.log("Active tab:", activeTab);
  }, [searchQuery, activeTab]);

  // Generate contextual suggestions based on user input
  React.useEffect(() => {
    if (tutorInput.trim().length > 3) {
      const input = tutorInput.toLowerCase();
      const newSuggestions: string[] = [];

      // Map of keywords to suggested questions based on actual chapter data
      const keywordMap: Record<string, string[]> = {
        // ========== MECHANICS (VOLUME 1) ==========
        // Kinematics
        'velocity': [
          "What is the difference between velocity and speed?",
          "Calculate velocity from position-time graphs",
          "Explain average vs instantaneous velocity"
        ],
        'acceleration': [
          "What is acceleration?",
          "Calculate acceleration from velocity",
          "Explain constant acceleration equations"
        ],
        'motion': [
          "Explain Newton's laws of motion",
          "Describe projectile motion",
          "Calculate motion in 2D"
        ],
        'projectile': [
          "How does projectile motion work?",
          "Calculate range and height of projectiles",
          "Explain trajectory of projectiles"
        ],

        // Forces
        'force': [
          "Explain Newton's laws of motion",
          "How do I calculate net force?",
          "What is the difference between mass and weight?"
        ],
        'newton': [
          "Explain Newton's three laws",
          "What is Newton's second law F=ma?",
          "Apply Newton's laws to problems"
        ],
        'friction': [
          "How does friction work?",
          "Calculate friction force on an incline",
          "What is the coefficient of friction?",
          "Explain static vs kinetic friction"
        ],
        'tension': [
          "What is tension in a rope?",
          "Calculate tension in pulleys",
          "Solve tension problems with multiple objects"
        ],
        'normal': [
          "What is normal force?",
          "Calculate normal force on inclines",
          "How does normal force relate to friction?"
        ],

        // Circular Motion
        'circular': [
          "Explain centripetal acceleration",
          "How do circular motion problems work?",
          "Calculate centripetal force"
        ],
        'centripetal': [
          "What is centripetal acceleration?",
          "Explain centripetal vs centrifugal force",
          "Calculate centripetal force"
        ],
        'rotation': [
          "Explain rotational motion",
          "What is angular velocity?",
          "Calculate rotational kinetic energy"
        ],
        'angular': [
          "What is angular velocity?",
          "Explain angular acceleration",
          "Calculate angular momentum"
        ],

        // Energy and Work
        'energy': [
          "What is conservation of energy?",
          "Calculate kinetic and potential energy",
          "Explain mechanical energy"
        ],
        'work': [
          "How is work calculated?",
          "What is work-energy theorem?",
          "Calculate work done by forces"
        ],
        'power': [
          "What is power in physics?",
          "Calculate power from work and time",
          "Explain power in mechanical systems"
        ],
        'potential': [
          "What is potential energy?",
          "Calculate gravitational potential energy",
          "Explain elastic potential energy"
        ],
        'kinetic': [
          "What is kinetic energy?",
          "Calculate kinetic energy",
          "Explain rotational kinetic energy"
        ],

        // Momentum and Collisions
        'momentum': [
          "Explain conservation of momentum",
          "How do elastic and inelastic collisions differ?",
          "Calculate momentum in a collision problem"
        ],
        'collision': [
          "Explain elastic vs inelastic collisions",
          "Calculate velocities after collision",
          "What is coefficient of restitution?"
        ],
        'impulse': [
          "What is impulse?",
          "Explain impulse-momentum theorem",
          "Calculate impulse from force-time graphs"
        ],

        // Gravity
        'gravity': [
          "Explain Newton's law of universal gravitation",
          "Calculate gravitational force between objects",
          "What is gravitational potential energy?"
        ],
        'gravitation': [
          "Explain universal gravitation",
          "Calculate orbital velocity",
          "What are Kepler's laws?"
        ],
        'orbit': [
          "How do orbits work?",
          "Calculate orbital period",
          "Explain satellite motion"
        ],

        // Oscillations
        'spring': [
          "Explain Hooke's law",
          "Calculate spring constant",
          "What is simple harmonic motion?",
          "Solve spring-mass system problems"
        ],
        'oscillation': [
          "What is simple harmonic motion?",
          "Calculate period of oscillation",
          "Explain pendulum motion"
        ],
        'pendulum': [
          "How does a pendulum work?",
          "Calculate period of a pendulum",
          "Explain simple vs physical pendulum"
        ],
        'harmonic': [
          "What is simple harmonic motion?",
          "Explain harmonic oscillators",
          "Calculate frequency and amplitude"
        ],

        // Rotational Dynamics
        'torque': [
          "What is torque?",
          "Calculate torque and rotational motion",
          "Explain torque vs force"
        ],
        'moment': [
          "What is moment of inertia?",
          "Calculate moment of inertia",
          "Explain rotational inertia"
        ],
        'inertia': [
          "What is moment of inertia?",
          "Explain rotational inertia",
          "Calculate angular momentum"
        ],

        // Fluids
        'fluid': [
          "Explain fluid dynamics",
          "What is Bernoulli's equation?",
          "Calculate pressure in fluids"
        ],
        'buoyancy': [
          "What is buoyancy?",
          "Explain Archimedes' principle",
          "Calculate buoyant force"
        ],
        'archimedes': [
          "Explain Archimedes' principle",
          "Calculate buoyant force",
          "What is displacement in fluids?"
        ],
        'pressure': [
          "What is pressure in fluids?",
          "Calculate pressure at depth",
          "Explain Pascal's principle"
        ],
        'density': [
          "What is density?",
          "Calculate density and specific gravity",
          "How does density affect buoyancy?"
        ],
        'bernoulli': [
          "Explain Bernoulli's equation",
          "Apply Bernoulli's principle to flow",
          "Calculate fluid velocity"
        ],
        'viscosity': [
          "What is viscosity?",
          "Explain fluid friction",
          "What is laminar vs turbulent flow?"
        ],

        // ========== THERMODYNAMICS (VOLUME 2) ==========
        // Chapter 1: Temperature and Heat
        'temperature': [
          "What's the difference between heat and temperature?",
          "How do I convert between temperature scales?",
          "Explain thermal expansion",
          "What is thermal equilibrium?"
        ],
        'heat': [
          "Explain the first law of thermodynamics",
          "What is the difference between heat and temperature?",
          "How does heat transfer work (conduction, convection, radiation)?",
          "Calculate heat transfer using Q = mcΔT"
        ],
        'expansion': [
          "Explain thermal expansion",
          "Calculate linear thermal expansion",
          "What is the coefficient of thermal expansion?"
        ],
        'phase': [
          "Explain phase transitions and changes",
          "What is latent heat?",
          "Describe melting and boiling points"
        ],
        'specific': [
          "What is specific heat capacity?",
          "Calculate heat using specific heat",
          "Why do different materials have different specific heats?"
        ],

        // Chapter 2: Kinetic Theory of Gases
        'kinetic': [
          "Explain kinetic theory of gases",
          "How does temperature relate to kinetic energy?",
          "Derive the ideal gas law from kinetic theory",
          "What is RMS speed of gas molecules?"
        ],
        'molecular': [
          "Explain the molecular model of gases",
          "What is mean free path?",
          "How do molecules move in a gas?"
        ],
        'gas': [
          "Derive the ideal gas law",
          "What are the assumptions of ideal gas?",
          "Explain gas processes (isothermal, adiabatic)",
          "Calculate pressure and temperature in gases"
        ],
        'pressure': [
          "Explain pressure in gases",
          "What is the PV diagram?",
          "How does pressure relate to temperature?"
        ],
        'rms': [
          "What is RMS speed?",
          "Calculate root-mean-square speed of molecules"
        ],

        // Chapter 3: First Law of Thermodynamics
        'first law': [
          "Explain the first law of thermodynamics",
          "How is energy conserved in thermodynamic processes?",
          "Calculate work and heat in the first law"
        ],
        'internal': [
          "What is internal energy?",
          "How does internal energy change?",
          "Explain internal energy in gases"
        ],
        'work': [
          "How is work related to heat?",
          "Calculate work done by a gas",
          "What is work in thermodynamic processes?"
        ],
        'adiabatic': [
          "What is an adiabatic process?",
          "Derive the adiabatic equation",
          "Explain adiabatic compression"
        ],
        'isothermal': [
          "What is an isothermal process?",
          "Calculate work in isothermal expansion"
        ],
        'isobaric': [
          "What is an isobaric process?",
          "Calculate work at constant pressure"
        ],
        'isochoric': [
          "What is an isochoric process?",
          "Why is no work done in isochoric processes?"
        ],

        // Chapter 4: Second Law and Entropy
        'entropy': [
          "How does entropy relate to disorder?",
          "Explain the second law of thermodynamics",
          "What is entropy in simple terms?",
          "Calculate entropy change"
        ],
        'carnot': [
          "What is the Carnot cycle?",
          "Explain Carnot efficiency",
          "Why is the Carnot engine most efficient?"
        ],
        'engine': [
          "How do heat engines work?",
          "Calculate heat engine efficiency",
          "What is the Carnot engine?"
        ],
        'refrigerator': [
          "How do refrigerators work?",
          "Calculate coefficient of performance",
          "Explain refrigeration cycles"
        ],
        'second law': [
          "Explain the second law of thermodynamics",
          "Why does entropy always increase?",
          "What are the implications of the second law?"
        ],

        // Electromagnetism
        'electric': [
          "Explain Coulomb's law",
          "What is an electric field?",
          "Calculate electric potential",
          "What is Gauss's law?"
        ],
        'magnetic': [
          "Explain magnetic fields",
          "What is the Lorentz force?",
          "How do magnetic fields work?",
          "Explain Faraday's law"
        ],
        'capacitor': [
          "What is a capacitor?",
          "Calculate capacitance",
          "Explain dielectrics in capacitors"
        ],
        'current': [
          "What is electric current?",
          "Explain Ohm's law",
          "Calculate current and resistance"
        ],
        'circuit': [
          "Explain series and parallel circuits",
          "What are Kirchhoff's rules?",
          "Analyze RC and RL circuits"
        ],
        'induction': [
          "Explain electromagnetic induction",
          "What is Faraday's law?",
          "What is Lenz's law?"
        ],
        'maxwell': [
          "Explain Maxwell's equations",
          "What is the electromagnetic spectrum?",
          "How do EM waves propagate?"
        ],

        // Optics and Waves
        'wave': [
          "Explain wave interference and diffraction",
          "What is the difference between transverse and longitudinal waves?",
          "How do standing waves form?",
          "Explain the double-slit experiment"
        ],
        'interference': [
          "Explain wave interference",
          "What is constructive and destructive interference?",
          "Solve Young's double-slit experiment"
        ],
        'diffraction': [
          "What is diffraction?",
          "Explain single-slit diffraction",
          "Calculate diffraction patterns"
        ],
        'reflection': [
          "Explain reflection of light",
          "What is the law of reflection?",
          "Calculate reflection angles"
        ],
        'refraction': [
          "What is refraction?",
          "Explain Snell's law",
          "Calculate angles of refraction"
        ],
        'lens': [
          "How do lenses work?",
          "Calculate focal length",
          "What is the lens equation?"
        ],
        'mirror': [
          "How do mirrors work?",
          "Calculate image distance in mirrors",
          "What is the mirror equation?"
        ],
        'polarization': [
          "What is polarization?",
          "Explain polarization of light",
          "How do polarizers work?"
        ],

        // General problem-solving
        'solve': [
          "Help me solve a calorimetry problem",
          "Walk me through a heat transfer problem",
          "Solve a thermodynamics problem step-by-step"
        ],
        'calculate': [
          "Help me calculate this physics problem",
          "Show me the calculation steps",
          "Walk through the math"
        ],
        'derive': [
          "Derive the ideal gas law",
          "Show me the derivation",
          "Prove this physics equation"
        ],
        'problem': [
          "Help me solve this problem",
          "Walk me through a physics problem",
          "Show me problem-solving steps"
        ]
      };

      // Check which keywords match
      for (const [keyword, questions] of Object.entries(keywordMap)) {
        if (input.includes(keyword)) {
          newSuggestions.push(...questions);
        }
      }

      // If we found relevant suggestions, use them; otherwise keep defaults
      if (newSuggestions.length > 0) {
        // Remove duplicates and limit to 4
        const unique = Array.from(new Set(newSuggestions)).slice(0, 4);
        setSuggestedQuestions(unique);
      }
    } else if (tutorInput.trim().length === 0) {
      // Reset to defaults when input is cleared
      setSuggestedQuestions([
        "Explain the first law of thermodynamics",
        "What's the difference between heat and temperature?",
        "Help me solve a calorimetry problem",
        "How does entropy relate to disorder?"
      ]);
    }
  }, [tutorInput]);

  const handleSendMessage = async () => {
    if (tutorInput.trim() && !isLoading) {
      const userMessage = tutorInput.trim();
      setTutorInput("");

      // Add user message to conversation
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userMessage
          })
        });

        const data = await response.json();

        if (data.success && data.claude_response) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.claude_response,
            usedTextbook: data.usedTextbook,
            warning: data.warning
          }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
      } catch (error) {
        console.error('Error calling Claude API:', error);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not connect to the teacher assistant. Please try again later.' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get all formulas from all chapters
  const allFormulas = chapters.flatMap(ch => ch.keyFormulas);

  // Filter content based on search query
  // Select the correct chapter array based on selected volume
  const currentChapterArray = selectedVolume === 'VOL1' ? volume1Chapters :
                              selectedVolume === 'VOL3' ? volume3Chapters :
                              chapters.filter(ch => ch.id <= 4); // VOL2: Only chapters 1-4

  const filteredChapters = currentChapterArray.filter(chapter =>
    searchQuery === "" ||
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
    chapter.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProblems = practiceProblems.filter(problem =>
    searchQuery === "" ||
    problem.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFormulas = allFormulas.filter(formula =>
    searchQuery === "" ||
    formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formula.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formula.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{
      minHeight: "100vh",
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
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Left Sidebar - Glassmorphism */}
      <Slide in={sidebarOpen} direction="right" timeout={500}>
        <Box
          sx={{
            width: 320,
            minWidth: 320,
            height: "100vh",
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Sidebar Header */}
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                Contents
              </Typography>
              <Button
                size="small"
                onClick={() => setSidebarOpen(false)}
                sx={{ minWidth: "auto", p: 0.5, color: "white" }}
              >
                ✕
              </Button>
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#E0F2FF !important",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                }
              }}
            />
          </Box>

          {/* Volume/Chapter List */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {volumeStructure.map((volume) => (
              <Box key={volume.id} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                  <Button
                    onClick={() => toggleVolume(volume.id)}
                    sx={{
                      minWidth: "auto",
                      color: "#E0F2FF !important",
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: 2,
                      p: 1.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.25)"
                      }
                    }}
                  >
                    <Typography sx={{ transform: expandedVolumes.includes(volume.id) ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
                      ▶
                    </Typography>
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => {
                      setSelectedVolume(volume.id as 'VOL1' | 'VOL2' | 'VOL3');
                      setSelectedChapter(null);
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      color: "#E0F2FF !important",
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: 2,
                      p: 1.5,
                      textAlign: "left",
                      fontWeight: 600,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.25)",
                        transform: "translateX(4px)"
                      }
                    }}
                  >
                    <Typography variant="body2">{volume.title}</Typography>
                  </Button>
                </Box>

                {expandedVolumes.includes(volume.id) && (
                  <Fade in>
                    <Box sx={{ pl: 2 }}>
                      {volume.chapters.map((chapterNum) => {
                        // Select the correct chapter array based on volume
                        const chapterArray = volume.id === 'VOL1' ? volume1Chapters :
                                            volume.id === 'VOL3' ? volume3Chapters : chapters;
                        const chapter = chapterArray.find(c => c.id === chapterNum);
                        if (!chapter) return null;
                        return (
                          <Button
                            key={chapterNum}
                            fullWidth
                            onClick={() => {
                              setSelectedVolume(volume.id as 'VOL1' | 'VOL2' | 'VOL3');
                              setSelectedChapter(chapterNum);
                              setActiveTab(0);
                            }}
                            sx={{
                              justifyContent: "flex-start",
                              color: "#E0F2FF !important",
                              background: selectedChapter === chapterNum && selectedVolume === volume.id
                                ? "rgba(255, 255, 255, 0.3)"
                                : "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              borderRadius: 1.5,
                              p: 1,
                              mb: 0.5,
                              textAlign: "left",
                              fontSize: "0.85rem",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.2)",
                                transform: "translateX(4px)"
                              }
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Box
                                sx={{
                                  minWidth: 24,
                                  height: 24,
                                  borderRadius: "6px",
                                  background: selectedChapter === chapterNum && selectedVolume === volume.id
                                    ? "white"
                                    : "rgba(255, 255, 255, 0.2)",
                                  color: selectedChapter === chapterNum && selectedVolume === volume.id ? "#667eea" : "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
                                  fontWeight: 700
                                }}
                              >
                                {chapterNum}
                              </Box>
                              <Typography variant="caption" sx={{ lineHeight: 1.3, color: "white" }}>
                                {chapter.title}
                              </Typography>
                            </Box>
                          </Button>
                        );
                      })}
                    </Box>
                  </Fade>
                )}
              </Box>
            ))}
          </Box>

          {/* Sidebar Footer */}
          <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleSignOut}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.5)",
                color: "#E0F2FF !important",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Slide>

      {/* Main Content Area */}
      <Box sx={{
        flex: 1,
        height: "100vh",
        overflowY: "auto",
        p: 4,
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        {!sidebarOpen && (
          <Button
            onClick={() => setSidebarOpen(true)}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              color: "#E0F2FF !important",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              zIndex: 1000,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)"
              }
            }}
          >
            Show Contents
          </Button>
        )}

        <Fade in timeout={800}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "#E0F2FF !important",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
              }}
            >
              <SchoolIcon fontSize="large" />
              Physics Study Hub
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 300, color: "white" }}>
              Heat & Thermodynamics Study Resources
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
              {["OpenStax Volume 1", "OpenStax Volume 2", "100% Free", "Community Driven"].map((label) => (
                <Chip
                  key={label}
                  label={label}
                  size="small"
                  sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    color: "#E0F2FF !important",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.3)",
                      transform: "translateY(-2px)"
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Fade>

        {/* Tabs */}
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              mb: 4,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 3,
              overflow: "hidden"
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                setActiveTab(newValue);
                setSelectedChapter(null); // Clear selected chapter when switching tabs
                // Update selected volume when clicking volume tabs
                if (newValue === 0) setSelectedVolume('VOL1');
                if (newValue === 1) setSelectedVolume('VOL2');
                if (newValue === 2) setSelectedVolume('VOL3');
              }}
              centered
              sx={{
                "& .MuiTab-root": {
                  color: "#E0F2FF !important",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#E0F2FF !important",
                    background: "rgba(255,255,255,0.1)"
                  },
                  "&.Mui-selected": {
                    color: "white"
                  }
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "white",
                  height: 3
                }
              }}
            >
              <Tab icon={<MenuBookIcon />} label="Volume 1" />
              <Tab icon={<MenuBookIcon />} label="Volume 2" />
              <Tab icon={<MenuBookIcon />} label="Volume 3" />
              <Tab icon={<QuizIcon />} label="Practice Problems" />
              <Tab icon={<CalculateIcon />} label="Formulas" />
              <Tab icon={<StyleIcon />} label="Flashcards" />
              <Tab icon={<SupportAgentIcon />} label="Teacher's Assistant" />
            </Tabs>
          </Paper>
        </Fade>

      {/* Volume 1 Tab (All chapters) */}
      {activeTab === 0 && selectedChapter === null && (
        <Box>
          <Typography variant="h4" sx={{ color: "#E0F2FF !important", mb: 3, fontWeight: 700 }}>
            {volumeStructure[0].title} - Chapters 1-{volume1Chapters.length}
          </Typography>
          <Grid container spacing={3}>
            {filteredChapters.map((chapter, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={chapter.id}>
                <Grow in timeout={400 + idx * 150}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: 3,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        background: "rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)"
                      },
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setSelectedVolume('VOL1');
                      setSelectedChapter(chapter.id);
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            minWidth: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#E0F2FF !important",
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                          }}
                        >
                          {chapter.id}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#E0F2FF !important",
                              lineHeight: 1.3,
                              textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                            }}
                          >
                            {chapter.title}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.3)" }} />

                      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 0.5, color: "white" }}>
                        Key Topics
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                        {chapter.topics.map((topic, topicIdx) => (
                          <Chip
                            key={topicIdx}
                            label={topic}
                            size="small"
                            sx={{
                              background: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              color: "#E0F2FF !important",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.4)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                              }
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          fullWidth
                          sx={{
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            textTransform: "none",
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            color: "#E0F2FF !important",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.5)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                            }
                          }}
                        >
                          View Chapter & Wiki →
                        </Button>
                        {chapter.openStaxUrl && (
                          <Button
                            href={chapter.openStaxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              py: 1.5,
                              px: 2,
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              textTransform: "none",
                              background: "rgba(100, 200, 255, 0.3)",
                              backdropFilter: "blur(10px)",
                              color: "#E0F2FF !important",
                              border: "1px solid rgba(100, 200, 255, 0.4)",
                              transition: "all 0.3s ease",
                              minWidth: "auto",
                              "&:hover": {
                                background: "rgba(100, 200, 255, 0.5)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                              }
                            }}
                          >
                            <AutoStoriesIcon />
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Volume 2 Tab (Chapters 1-4 only) */}
      {activeTab === 1 && selectedChapter === null && (
        <Box>
          <Typography variant="h4" sx={{ color: "#E0F2FF !important", mb: 3, fontWeight: 700 }}>
            {volumeStructure[1].title} - Chapters 1-{chapters.length}
          </Typography>
          <Grid container spacing={3}>
            {filteredChapters.map((chapter, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={chapter.id}>
                <Grow in timeout={400 + idx * 150}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: 3,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        background: "rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)"
                      },
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setSelectedVolume('VOL2');
                      setSelectedChapter(chapter.id);
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            minWidth: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#E0F2FF !important",
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                          }}
                        >
                          {chapter.id}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#E0F2FF !important",
                            lineHeight: 1.3,
                            textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                          }}
                        >
                          {chapter.title}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.3)" }} />

                      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 0.5, color: "white" }}>
                        Key Topics
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                        {chapter.topics.map((topic, topicIdx) => (
                          <Chip
                            key={topicIdx}
                            label={topic}
                            size="small"
                            sx={{
                              background: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              color: "#E0F2FF !important",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.4)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                              }
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          fullWidth
                          sx={{
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            textTransform: "none",
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            color: "#E0F2FF !important",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.5)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                            }
                          }}
                        >
                          View Chapter & Wiki →
                        </Button>
                        {chapter.openStaxUrl && (
                          <Button
                            href={chapter.openStaxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              py: 1.5,
                              px: 2,
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              textTransform: "none",
                              background: "rgba(100, 200, 255, 0.3)",
                              backdropFilter: "blur(10px)",
                              color: "#E0F2FF !important",
                              border: "1px solid rgba(100, 200, 255, 0.4)",
                              transition: "all 0.3s ease",
                              minWidth: "auto",
                              "&:hover": {
                                background: "rgba(100, 200, 255, 0.5)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                              }
                            }}
                          >
                            <AutoStoriesIcon />
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Volume 3 Tab (Chapters 1-4 only, with cross-reference to Vol 1 Ch 16) */}
      {activeTab === 2 && selectedChapter === null && (
        <Box>
          <Typography variant="h4" sx={{ color: "#E0F2FF !important", mb: 3, fontWeight: 700 }}>
            {volumeStructure[2].title} - Chapters 1-{volume3Chapters.length}
          </Typography>
          <Grid container spacing={3}>
            {filteredChapters.map((chapter, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={chapter.id}>
                <Grow in timeout={400 + idx * 150}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: 3,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        background: "rgba(255, 255, 255, 0.25)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.5)"
                      },
                      cursor: "pointer"
                    }}
                    onClick={() => {
                      setSelectedVolume('VOL3');
                      setSelectedChapter(chapter.id);
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            minWidth: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#E0F2FF !important",
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                          }}
                        >
                          {chapter.id}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#E0F2FF !important",
                              lineHeight: 1.3,
                              textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                            }}
                          >
                            {chapter.title}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.3)" }} />

                      <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 0.5, color: "white" }}>
                        Key Topics
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
                        {chapter.topics.map((topic, topicIdx) => (
                          <Chip
                            key={topicIdx}
                            label={topic}
                            size="small"
                            sx={{
                              background: "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              color: "#E0F2FF !important",
                              fontSize: "0.8rem",
                              fontWeight: 500,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.4)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                              }
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          fullWidth
                          sx={{
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            textTransform: "none",
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            color: "#E0F2FF !important",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.5)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                            }
                          }}
                        >
                          View Chapter & Wiki →
                        </Button>
                        {chapter.openStaxUrl && (
                          <Button
                            href={chapter.openStaxUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              py: 1.5,
                              px: 2,
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              textTransform: "none",
                              background: "rgba(100, 200, 255, 0.3)",
                              backdropFilter: "blur(10px)",
                              color: "#E0F2FF !important",
                              border: "1px solid rgba(100, 200, 255, 0.4)",
                              transition: "all 0.3s ease",
                              minWidth: "auto",
                              "&:hover": {
                                background: "rgba(100, 200, 255, 0.5)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                              }
                            }}
                          >
                            <AutoStoriesIcon />
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {(activeTab === 0 || activeTab === 1 || activeTab === 2) && selectedChapter !== null && (() => {
        // Determine which chapter array to use based on selected volume
        const chapterArray = selectedVolume === 'VOL1' ? volume1Chapters :
                            selectedVolume === 'VOL3' ? volume3Chapters : chapters;
        const chapter = chapterArray.find(ch => ch.id === selectedChapter);
        if (!chapter) return null;
        return (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setSelectedChapter(null)}
              sx={{
                mb: 3,
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#E0F2FF !important",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.25)",
                  border: "1px solid rgba(255, 255, 255, 0.5)"
                }
              }}
            >
              ← Back to All Chapters
            </Button>
            <Card
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "white", flex: 1 }}>
                    Chapter {chapter.id}: {chapter.title}
                  </Typography>
                  {chapter.openStaxUrl && (
                    <Button
                      href={chapter.openStaxUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<AutoStoriesIcon />}
                      sx={{
                        ml: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textTransform: "none",
                        background: "rgba(100, 200, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        color: "#E0F2FF !important",
                        border: "1px solid rgba(100, 200, 255, 0.4)",
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(100, 200, 255, 0.5)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                        }
                      }}
                    >
                      Read on OpenStax
                    </Button>
                  )}
                </Box>
                <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.3)" }} />

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
                  Summary
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, color: "white" }}>
                  {chapter.summary}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
                  Key Topics
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
                  {chapter.topics.map((topic, idx) => (
                    <Chip
                      key={idx}
                      label={topic}
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        color: "#E0F2FF !important",
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
                  Key Formulas
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {chapter.keyFormulas.map((formula, idx) => (
                    <Grid size={{ xs: 12 }} key={idx}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: 2
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "white" }}>
                          {formula.name}
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 1,
                            background: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(5px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            fontFamily: "monospace",
                            fontSize: "1.1rem",
                            textAlign: "center",
                            color: "white"
                          }}
                        >
                          <FormulaText formula={formula.formula} />
                        </Paper>
                        <Typography variant="body2" sx={{ color: "white" }}>
                          {formula.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
                  Key Concepts
                </Typography>
                <List>
                  {chapter.concepts.map((concept, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={concept.term}
                        secondary={concept.definition}
                        primaryTypographyProps={{ fontWeight: 600, color: "white" }}
                        secondaryTypographyProps={{ color: "white" }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.3)" }} />

                {/* Collaborative Wiki Section */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
                  Collaborative Wiki & Notes
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: "rgba(100, 180, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(100, 180, 255, 0.3)",
                    borderRadius: 2,
                    mb: 3
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
                    Share your notes, insights, and explanations with classmates. Everyone can contribute to build a comprehensive study resource!
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(10px)",
                        color: "#E0F2FF !important",
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.4)"
                        }
                      }}
                    >
                      View Class Notes
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        color: "#E0F2FF !important",
                        "&:hover": {
                          borderColor: "white",
                          background: "rgba(255, 255, 255, 0.1)"
                        }
                      }}
                    >
                      Add Your Notes
                    </Button>
                  </Box>
                </Paper>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: "white" }}>
                  Recent Contributions
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 2,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "white" }}>
                      Study Tips for {chapter.title}
                    </Typography>
                    <Chip
                      label="2 days ago"
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "#E0F2FF !important",
                        border: "1px solid rgba(255, 255, 255, 0.3)"
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, color: "white" }}>
                    Remember: Temperature measures average kinetic energy, while heat is energy transfer. Use real-world examples like coffee cooling down!
                  </Typography>
                  <Typography variant="caption" sx={{ color: "white" }}>
                    Shared by Student - 12 helpful
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "white" }}>
                      Common Mistakes to Avoid
                    </Typography>
                    <Chip
                      label="1 week ago"
                      size="small"
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "#E0F2FF !important",
                        border: "1px solid rgba(255, 255, 255, 0.3)"
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, color: "white" }}>
                    Don't confuse thermal expansion coefficients! Linear (α) vs. volumetric (β = 3α) - remember the factor of 3!
                  </Typography>
                  <Typography variant="caption" sx={{ color: "white" }}>
                    Shared by Student - 8 helpful
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
        );
      })()}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          {filteredProblems.map((problem, idx) => (
            <Grid size={{ xs: 12 }} key={problem.id}>
              <Grow in timeout={400 + idx * 100}>
                <Card
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.2)",
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
                        Problem #{problem.id}
                      </Typography>
                      <Chip
                        label={problem.difficulty}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          background: problem.difficulty === "Easy"
                            ? "rgba(76, 175, 80, 0.3)"
                            : problem.difficulty === "Medium"
                            ? "rgba(255, 152, 0, 0.3)"
                            : "rgba(244, 67, 54, 0.3)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.3)",
                          color: "#E0F2FF !important",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.1)"
                          }
                        }}
                      />
                    </Box>
                    <Chip
                      label={problem.topic}
                      size="small"
                      sx={{
                        mb: 2,
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        color: "#E0F2FF !important",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.3)"
                        }
                      }}
                    />
                    <Typography variant="body1" sx={{ mb: 2, color: "white" }}>
                      {problem.question}
                    </Typography>
                    {showSolution === problem.id ? (
                      <Fade in>
                        <Box>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              background: "rgba(76, 175, 80, 0.2)",
                              backdropFilter: "blur(10px)",
                              mb: 2,
                              borderRadius: 2,
                              border: "1px solid rgba(76, 175, 80, 0.4)"
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "white" }}>Solution:</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "white" }}>{problem.solution}</Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2, color: "white" }}>Answer: {problem.answer}</Typography>
                          </Paper>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowSolution(null)}
                            sx={{
                              borderColor: "rgba(255, 255, 255, 0.5)",
                              color: "#E0F2FF !important",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: "white",
                                background: "rgba(255, 255, 255, 0.1)",
                                transform: "scale(1.05)"
                              }
                            }}
                          >
                            Hide Solution
                          </Button>
                        </Box>
                      </Fade>
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setShowSolution(problem.id)}
                        sx={{
                          background: "rgba(255, 255, 255, 0.3)",
                          backdropFilter: "blur(10px)",
                          color: "#E0F2FF !important",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            background: "rgba(255, 255, 255, 0.4)",
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                          }
                        }}
                      >
                        Show Solution
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
          {filteredProblems.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: 3
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  No practice problems found matching "{searchQuery}"
                </Typography>
              </Paper>
            </Grid>
          )}
          {filteredProblems.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: "center",
                  background: "rgba(100, 180, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(100, 180, 255, 0.3)",
                  borderRadius: 3
                }}
              >
                <Typography variant="body1" sx={{ color: "white" }}>
                  More practice problems coming soon! You can add your own by contributing to the study hub.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          {filteredFormulas.map((formula, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Zoom in timeout={300 + idx * 80} style={{ transitionDelay: `${idx * 50}ms` }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: 3,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      background: "rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                    }
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: "white"
                      }}
                    >
                      {formula.name}
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        fontFamily: "monospace",
                        fontSize: "1.2rem",
                        textAlign: "center",
                        borderRadius: 2,
                        color: "#E0F2FF !important",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.3)",
                          transform: "scale(1.05)"
                        }
                      }}
                    >
                      <FormulaText formula={formula.formula} />
                    </Paper>
                    <Typography variant="body2" sx={{ mb: 2, color: "white" }}>
                      {formula.description}
                    </Typography>
                    {formula.variables && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1,
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(5px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 600, color: "white" }}>Variables:</Typography>
                        {formula.variables.map((v, i) => (
                          <Typography
                            key={i}
                            variant="caption"
                            display="block"
                            sx={{
                              ml: 1,
                              color: "#E0F2FF !important",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                color: "#E0F2FF !important",
                                transform: "translateX(4px)"
                              }
                            }}
                          >
                            <strong>{v.symbol}</strong>: {v.description} {v.unit && `(${v.unit})`}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
          {filteredFormulas.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: 3
                }}
              >
                <Typography variant="h6" sx={{ color: "white" }}>
                  No formulas found matching "{searchQuery}"
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 5 && (
        <Fade in timeout={600}>
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Card
              elevation={0}
              sx={{
                minHeight: 300,
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: "white" }}>
                  {flashcards[currentFlashcard].topic}
                </Typography>
                <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.3)" }} />
                <Box
                  sx={{
                    minHeight: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    position: "relative",
                    perspective: "1000px"
                  }}
                >
                  <Fade in={!showAnswer} timeout={300} unmountOnExit>
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 500, color: "white" }}>
                        {flashcards[currentFlashcard].front}
                      </Typography>
                    </Box>
                  </Fade>
                  <Fade in={showAnswer} timeout={300} unmountOnExit>
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(100, 180, 255, 0.2)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(100, 180, 255, 0.3)",
                        borderRadius: 2,
                        p: 2
                      }}
                    >
                      <Typography variant="body1" sx={{ textAlign: "center", color: "white" }}>
                        {flashcards[currentFlashcard].back}
                      </Typography>
                    </Box>
                  </Fade>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowAnswer(false);
                      setCurrentFlashcard((currentFlashcard - 1 + flashcards.length) % flashcards.length);
                    }}
                    disabled={flashcards.length === 0}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      color: "#E0F2FF !important",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "white",
                        background: "rgba(255, 255, 255, 0.1)",
                        transform: "translateX(-4px)"
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setShowAnswer(!showAnswer)}
                    sx={{
                      background: "rgba(255, 255, 255, 0.3)",
                      backdropFilter: "blur(10px)",
                      color: "#E0F2FF !important",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.4)",
                        transform: "scale(1.1)"
                      }
                    }}
                  >
                    {showAnswer ? "Show Question" : "Show Answer"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowAnswer(false);
                      setCurrentFlashcard((currentFlashcard + 1) % flashcards.length);
                    }}
                    disabled={flashcards.length === 0}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      color: "#E0F2FF !important",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "white",
                        background: "rgba(255, 255, 255, 0.1)",
                        transform: "translateX(4px)"
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2, color: "white" }}>
                  Card {currentFlashcard + 1} of {flashcards.length}
                </Typography>
              </CardContent>
            </Card>
            <Slide in direction="up" timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 2,
                  textAlign: "center",
                  background: "rgba(100, 180, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(100, 180, 255, 0.3)",
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" sx={{ color: "white" }}>
                  Tip: Use flashcards for quick review before exams. Try to answer before flipping!
                </Typography>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      )}

      {activeTab === 6 && (
        <Fade in timeout={600}>
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            <Card
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
                }
              }}
            >
              <CardContent>
                <Zoom in timeout={600}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <SupportAgentIcon fontSize="large" sx={{ color: "white" }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: "white" }}>
                        AI Teacher's Assistant
                      </Typography>
                      <Typography variant="body2" sx={{ color: "white" }}>
                        Ask me anything about heat and thermodynamics
                      </Typography>
                    </Box>
                  </Box>
                </Zoom>
                <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.3)" }} />

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    minHeight: 400,
                    maxHeight: 600,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    borderRadius: 2
                  }}
                >
                  {messages.length === 0 ? (
                    <Fade in timeout={1000}>
                      <Typography variant="body1" sx={{ textAlign: "center", mt: 10, color: "white" }}>
                        Your conversation will appear here...
                      </Typography>
                    </Fade>
                  ) : (
                    messages.map((msg, idx) => (
                      <Slide
                        key={idx}
                        in
                        direction={msg.role === 'user' ? 'left' : 'right'}
                        timeout={400}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            gap: 0.5
                          }}
                        >
                          {msg.role === 'assistant' && msg.warning && (
                            <Chip
                              label={msg.warning}
                              size="small"
                              icon={<WarningIcon sx={{ fontSize: '1rem' }} />}
                              sx={{
                                background: "rgba(255, 152, 0, 0.3)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255, 152, 0, 0.5)",
                                color: "#E0F2FF !important",
                                fontSize: "0.7rem",
                                height: "auto",
                                py: 0.5,
                                "& .MuiChip-icon": {
                                  color: "#E0F2FF !important",
                                  marginLeft: "4px"
                                }
                              }}
                            />
                          )}
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              maxWidth: '75%',
                              background: msg.role === 'user'
                                ? "rgba(100, 180, 255, 0.3)"
                                : msg.warning
                                ? "rgba(255, 152, 0, 0.2)"
                                : "rgba(255, 255, 255, 0.2)",
                              backdropFilter: "blur(10px)",
                              border: msg.role === 'user'
                                ? "1px solid rgba(100, 180, 255, 0.5)"
                                : msg.warning
                                ? "1px solid rgba(255, 152, 0, 0.4)"
                                : "1px solid rgba(255, 255, 255, 0.3)",
                              color: "#E0F2FF !important",
                              borderRadius: 3,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                              }
                            }}
                          >
                            {msg.role === 'user' ? (
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: "white" }}>
                                {msg.content}
                              </Typography>
                            ) : (
                              <Box sx={{
                                '& p': { m: 0, mb: 1, color: "white" },
                                '& p:last-child': { mb: 0 },
                                '& code': {
                                  background: "rgba(0, 0, 0, 0.2)",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  color: "rgba(255, 200, 100, 1)"
                                },
                                '& pre': {
                                  background: "rgba(0, 0, 0, 0.2)",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  overflowX: "auto"
                                }
                              }}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </Box>
                            )}
                          </Paper>
                          {msg.role === 'assistant' && msg.usedTextbook === true && (
                            <Chip
                              label="✓ Using OpenStax textbooks"
                              size="small"
                              sx={{
                                background: "rgba(76, 175, 80, 0.3)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(76, 175, 80, 0.5)",
                                color: "#E0F2FF !important",
                                fontSize: "0.7rem",
                                height: "auto",
                                py: 0.3
                              }}
                            />
                          )}
                        </Box>
                      </Slide>
                    ))
                  )}
                  {isLoading && (
                    <Fade in>
                      <Box sx={{ display: "flex", justifyContent: 'flex-start', alignItems: "center", gap: 2 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            background: "rgba(255, 255, 255, 0.2)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                          }}
                        >
                          {/* Physics-themed loader: Atom with orbiting electrons */}
                          <Box
                            sx={{
                              position: "relative",
                              width: 24,
                              height: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            {/* Nucleus */}
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "white",
                                position: "absolute",
                                zIndex: 2
                              }}
                            />
                            {/* Orbit 1 */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: 20,
                                height: 20,
                                border: "1px solid rgba(255, 255, 255, 0.4)",
                                borderRadius: "50%",
                                animation: "spin 1.5s linear infinite",
                                "@keyframes spin": {
                                  "0%": { transform: "rotate(0deg)" },
                                  "100%": { transform: "rotate(360deg)" }
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  background: "rgba(100, 180, 255, 1)",
                                  position: "absolute",
                                  top: -2,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  boxShadow: "0 0 8px rgba(100, 180, 255, 0.8)"
                                }}
                              />
                            </Box>
                            {/* Orbit 2 */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: 20,
                                height: 20,
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                borderRadius: "50%",
                                transform: "rotate(60deg)",
                                animation: "spin 2s linear infinite reverse",
                                "@keyframes spin": {
                                  "0%": { transform: "rotate(60deg)" },
                                  "100%": { transform: "rotate(420deg)" }
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  background: "rgba(255, 140, 80, 1)",
                                  position: "absolute",
                                  top: -2,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  boxShadow: "0 0 8px rgba(255, 140, 80, 0.8)"
                                }}
                              />
                            </Box>
                            {/* Orbit 3 */}
                            <Box
                              sx={{
                                position: "absolute",
                                width: 20,
                                height: 20,
                                border: "1px solid rgba(255, 255, 255, 0.3)",
                                borderRadius: "50%",
                                transform: "rotate(120deg)",
                                animation: "spin 2.5s linear infinite",
                                "@keyframes spin": {
                                  "0%": { transform: "rotate(120deg)" },
                                  "100%": { transform: "rotate(480deg)" }
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  width: 4,
                                  height: 4,
                                  borderRadius: "50%",
                                  background: "rgba(100, 255, 180, 1)",
                                  position: "absolute",
                                  top: -2,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  boxShadow: "0 0 8px rgba(100, 255, 180, 0.8)"
                                }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ color: "white" }}>
                            Thinking...
                          </Typography>
                        </Paper>
                      </Box>
                    </Fade>
                  )}
                </Paper>

                {/* Suggested Questions */}
                <Fade in timeout={500}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                      <LightbulbIcon sx={{ fontSize: "1rem", color: "white" }} />
                      <Typography variant="caption" sx={{ color: "#E0F2FF !important", fontWeight: 600 }}>
                        Suggested Questions:
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {suggestedQuestions.map((question, idx) => (
                        <Grow in timeout={300 + idx * 100} key={question}>
                          <Chip
                            label={question}
                            onClick={() => {
                              setTutorInput(question);
                            }}
                            sx={{
                              background: "rgba(100, 180, 255, 0.25)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(100, 180, 255, 0.4)",
                              color: "#E0F2FF !important",
                              fontSize: "0.85rem",
                              py: 2.5,
                              px: 1,
                              height: "auto",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: "rgba(100, 180, 255, 0.4)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(100, 180, 255, 0.3)"
                              },
                              "& .MuiChip-label": {
                                whiteSpace: "normal",
                                lineHeight: 1.3
                              }
                            }}
                          />
                        </Grow>
                      ))}
                    </Box>
                  </Box>
                </Fade>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Ask a question about thermodynamics..."
                  variant="outlined"
                  multiline
                  maxRows={4}
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#E0F2FF !important",
                      background: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
                      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#E0F2FF !important",
                      opacity: 1
                    }
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(10px)",
                    color: "#E0F2FF !important",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.4)",
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                    },
                    "&:disabled": {
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "rgba(255, 255, 255, 0.5)"
                    }
                  }}
                  onClick={handleSendMessage}
                  disabled={isLoading || !tutorInput.trim()}
                >
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </Box>
            </CardContent>
          </Card>
          </Box>
        </Fade>
      )}
      </Box>
    </Box>
  );
}
