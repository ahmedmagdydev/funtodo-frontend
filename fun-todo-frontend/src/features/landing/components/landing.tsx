import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowRight, Wifi, Shield, BarChart ,Upload} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const LandingPage = () => {
  // const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} lg={5}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                  Welcome to FunToDo
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
                  Your personal IoT sensor dashboard. Connect, monitor, and
                  manage your devices in real-time with our intuitive interface.
                  Stay connected to what matters most.
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/login')} endIcon={<ArrowRight />}>
                  Get Started
                </Button>
                <Button variant="outlined" size="large" onClick={() => {
                  axios.post('https://api.netlify.com/build_hooks/67a882232d93a68ef4b5c281',null)
                }}  endIcon={<Upload />} sx={{ mx: 2 }}>
                  deploy changes
                </Button>
              </motion.div>
            </Grid>

            {/* Preview Section */}
            <Grid item xs={12} lg={7}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper elevation={8} sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <Box sx={{ position: "relative", aspectRatio: "16/9", bgcolor: "action.hover" }}>
                    <Box sx={{ position: "absolute", inset: 0, p: 2 }}>
                      <Grid container spacing={2}>
                        {/* Sample Widgets */}
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, height: "100%" }}>
                            <Shield sx={{ color: "primary.main", mb: 1, width: 24, height: 24 }} />
                            <Box sx={{ height: 96, bgcolor: "action.hover", borderRadius: 1, animation: "pulse 2s infinite" }} />
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper sx={{ p: 2, height: "100%" }}>
                            <BarChart sx={{ color: "primary.main", mb: 1, width: 24, height: 24 }} />
                            <Box sx={{ height: 96, bgcolor: "action.hover", borderRadius: 1, animation: "pulse 2s infinite" }} />
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: "action.hover", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              {
                icon: <Wifi />,
                title: "Real-time Updates",
                description: "Get instant updates from your sensors with real-time WebSocket connections."
              },
              {
                icon: <Shield />,
                title: "Custom Widgets",
                description: "Create and customize widgets to display your sensor data exactly how you want."
              },
              {
                icon: <BarChart />,
                title: "Data Analytics",
                description: "Analyze your sensor data with powerful visualization tools and insights."
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <Paper sx={{ p: 3, height: "100%" }}>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};