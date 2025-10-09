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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuizIcon from "@mui/icons-material/Quiz";
import CalculateIcon from "@mui/icons-material/Calculate";
import StyleIcon from "@mui/icons-material/Style";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ReactMarkdown from "react-markdown";
import { chapters, practiceProblems, flashcards } from "@/data/physicsContent";

export default function PhysicsStudyHub() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedChapter, setSelectedChapter] = React.useState<number | null>(null);
  const [showSolution, setShowSolution] = React.useState<number | null>(null);
  const [currentFlashcard, setCurrentFlashcard] = React.useState(0);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [tutorInput, setTutorInput] = React.useState("");
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    console.log("Physics Study Hub loaded successfully!");
    console.log("Search query:", searchQuery);
    console.log("Active tab:", activeTab);
  }, [searchQuery, activeTab]);

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
          setMessages(prev => [...prev, { role: 'assistant', content: data.claude_response }]);
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
  const filteredChapters = chapters.filter(chapter =>
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
      bgcolor: "background.default",
      p: 3,
      position: "relative",
      zIndex: 9999,
      pointerEvents: "auto",
      "& *": { pointerEvents: "auto" }
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <SchoolIcon fontSize="large" color="primary" />
          Physics Study Hub
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Heat & Thermodynamics Study Resources
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
          <Chip label="OpenStax Volume 1" size="small" color="primary" variant="outlined" />
          <Chip label="OpenStax Volume 2" size="small" color="primary" variant="outlined" />
          <Chip label="100% Free" size="small" color="success" variant="outlined" />
          <Chip label="Community Driven" size="small" color="secondary" variant="outlined" />
        </Box>
      </Box>

      {/* Search Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 4, maxWidth: 800, mx: "auto" }}>
        <TextField
          fullWidth
          placeholder="Search topics, formulas, or concepts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
          <Tab icon={<MenuBookIcon />} label="Chapters" />
          <Tab icon={<QuizIcon />} label="Practice Problems" />
          <Tab icon={<CalculateIcon />} label="Formulas" />
          <Tab icon={<StyleIcon />} label="Flashcards" />
          <Tab icon={<SupportAgentIcon />} label="Teacher's Assistant" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && selectedChapter === null && (
        <Grid container spacing={3}>
          {filteredChapters.map((chapter) => (
            <Grid size={{ xs: 12, md: 6 }} key={chapter.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                    Chapter {chapter.id}: {chapter.title}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Key Topics:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {chapter.topics.map((topic, idx) => (
                      <Chip key={idx} label={topic} size="small" />
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setSelectedChapter(chapter.id)}
                  >
                    View Chapter Summary
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredChapters.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", bgcolor: "grey.100" }}>
                <Typography variant="h6" color="text.secondary">
                  No chapters found matching "{searchQuery}"
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 0 && selectedChapter !== null && (() => {
        const chapter = chapters.find(ch => ch.id === selectedChapter);
        if (!chapter) return null;
        return (
          <Box>
            <Button
              variant="outlined"
              onClick={() => setSelectedChapter(null)}
              sx={{ mb: 3 }}
            >
              ← Back to All Chapters
            </Button>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "primary.main" }}>
                  Chapter {chapter.id}: {chapter.title}
                </Typography>
                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  📖 Summary
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                  {chapter.summary}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🎯 Key Topics
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
                  {chapter.topics.map((topic, idx) => (
                    <Chip key={idx} label={topic} color="primary" />
                  ))}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  🧮 Key Formulas
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {chapter.keyFormulas.map((formula, idx) => (
                    <Grid size={{ xs: 12 }} key={idx}>
                      <Paper elevation={1} sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {formula.name}
                        </Typography>
                        <Paper elevation={0} sx={{ p: 2, mb: 1, bgcolor: "grey.100", fontFamily: "monospace", fontSize: "1.1rem", textAlign: "center" }}>
                          {formula.formula}
                        </Paper>
                        <Typography variant="body2" color="text.secondary">
                          {formula.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  💡 Key Concepts
                </Typography>
                <List>
                  {chapter.concepts.map((concept, idx) => (
                    <ListItem key={idx}>
                      <ListItemText
                        primary={concept.term}
                        secondary={concept.definition}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        );
      })()}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {filteredProblems.map((problem) => (
            <Grid size={{ xs: 12 }} key={problem.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Problem #{problem.id}
                    </Typography>
                    <Chip
                      label={problem.difficulty}
                      size="small"
                      color={problem.difficulty === "Easy" ? "success" : problem.difficulty === "Medium" ? "warning" : "error"}
                    />
                  </Box>
                  <Chip label={problem.topic} size="small" sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {problem.question}
                  </Typography>
                  {showSolution === problem.id ? (
                    <>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "success.light", mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Solution:</Typography>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>{problem.solution}</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2 }}>Answer: {problem.answer}</Typography>
                      </Paper>
                      <Button variant="outlined" size="small" onClick={() => setShowSolution(null)}>
                        Hide Solution
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" size="small" onClick={() => setShowSolution(problem.id)}>
                      Show Solution
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredProblems.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", bgcolor: "grey.100" }}>
                <Typography variant="h6" color="text.secondary">
                  No practice problems found matching "{searchQuery}"
                </Typography>
              </Paper>
            </Grid>
          )}
          {filteredProblems.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 3, textAlign: "center", bgcolor: "primary.light", color: "primary.contrastText" }}>
                <Typography variant="body1">
                  📚 More practice problems coming soon! You can add your own by contributing to the study hub.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {filteredFormulas.map((formula, idx) => (
            <Grid size={{ xs: 12, md: 6 }} key={idx}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {formula.name}
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "grey.100", fontFamily: "monospace", fontSize: "1.2rem", textAlign: "center" }}>
                    {formula.formula}
                  </Paper>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {formula.description}
                  </Typography>
                  {formula.variables && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Variables:</Typography>
                      {formula.variables.map((v, i) => (
                        <Typography key={i} variant="caption" display="block" sx={{ ml: 1 }}>
                          <strong>{v.symbol}</strong>: {v.description} {v.unit && `(${v.unit})`}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
          {filteredFormulas.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={{ p: 4, textAlign: "center", bgcolor: "grey.100" }}>
                <Typography variant="h6" color="text.secondary">
                  No formulas found matching "{searchQuery}"
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 3 && (
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Card elevation={3} sx={{ minHeight: 300 }}>
            <CardContent>
              <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                {flashcards[currentFlashcard].topic}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
                {!showAnswer ? (
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    {flashcards[currentFlashcard].front}
                  </Typography>
                ) : (
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    {flashcards[currentFlashcard].back}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowAnswer(false);
                    setCurrentFlashcard((currentFlashcard - 1 + flashcards.length) % flashcards.length);
                  }}
                  disabled={flashcards.length === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowAnswer(!showAnswer)}
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
                >
                  Next
                </Button>
              </Box>
              <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2 }}>
                Card {currentFlashcard + 1} of {flashcards.length}
              </Typography>
            </CardContent>
          </Card>
          <Paper elevation={0} sx={{ mt: 3, p: 2, textAlign: "center", bgcolor: "info.light" }}>
            <Typography variant="body2">
              💡 Tip: Use flashcards for quick review before exams. Try to answer before flipping!
            </Typography>
          </Paper>
        </Box>
      )}

      {activeTab === 4 && (
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <SupportAgentIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    AI Teacher's Assistant
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ask me anything about heat and thermodynamics
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: "grey.50",
                  minHeight: 400,
                  maxHeight: 600,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2
                }}
              >
                {messages.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", mt: 10 }}>
                    Your conversation will appear here...
                  </Typography>
                ) : (
                  messages.map((msg, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          maxWidth: '75%',
                          bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                          color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary'
                        }}
                      >
                        {msg.role === 'user' ? (
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                          </Typography>
                        ) : (
                          <Box sx={{ '& p': { m: 0, mb: 1 }, '& p:last-child': { mb: 0 } }}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  ))
                )}
                {isLoading && (
                  <Box sx={{ display: "flex", justifyContent: 'flex-start' }}>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                      <Typography variant="body2" color="text.secondary">
                        Thinking...
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Paper>

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
                />
                <Button
                  variant="contained"
                  size="large"
                  sx={{ px: 4 }}
                  onClick={handleSendMessage}
                  disabled={isLoading || !tutorInput.trim()}
                >
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Paper elevation={0} sx={{ mt: 3, p: 3, bgcolor: "primary.light", color: "primary.contrastText" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              💡 Example Questions:
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2">• "Explain the first law of thermodynamics"</Typography>
              <Typography variant="body2">• "What's the difference between heat and temperature?"</Typography>
              <Typography variant="body2">• "Help me solve a calorimetry problem"</Typography>
              <Typography variant="body2">• "How does entropy relate to disorder?"</Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
