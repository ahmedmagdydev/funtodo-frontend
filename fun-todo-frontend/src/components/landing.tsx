
// import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowRight, Wifi, Shield, BarChart } from "@mui/icons-material";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="lg:grid lg:grid-cols-[.75fr_1fr] lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                  Welcome to FunToDo
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Your personal IoT sensor dashboard. Connect, monitor, and
                  manage your devices in real-time with our intuitive interface.
                  Stay connected to what matters most.
                </p>
                <Button size="large" onClick={onGetStarted}>
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative rounded-lg overflow-hidden border bg-card shadow-2xl"
            >
              <div className="aspect-[16/9] relative bg-muted">
                <div className="absolute inset-0 p-4 grid grid-cols-2 gap-4">
                  {/* Sample Widgets */}
                  <div className="bg-background rounded-lg p-4 shadow-lg">
                    <Shield className="h-6 w-6 mb-2 text-primary" />
                    <div className="h-24 rounded-md bg-muted animate-pulse" />
                  </div>
                  <div className="bg-background rounded-lg p-4 shadow-lg">
                    <BarChart className="h-6 w-6 mb-2 text-primary" />
                    <div className="h-24 rounded-md bg-muted animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-background p-6 rounded-lg shadow-lg"
            >
              <Wifi className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Get instant updates from your sensors with real-time WebSocket
                connections.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-background p-6 rounded-lg shadow-lg"
            >
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Widgets</h3>
              <p className="text-muted-foreground">
                Create and customize widgets to display your sensor data exactly
                how you want.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-background p-6 rounded-lg shadow-lg"
            >
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-muted-foreground">
                Protect your data with secure authentication and encrypted
                connections.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
 