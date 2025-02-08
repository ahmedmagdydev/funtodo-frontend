import { SxProps, Theme } from "@mui/material";
import { getRandomBackground } from "../utils/backgroundImages";

// Get a random background image that will stay consistent during the session
const backgroundImage = getRandomBackground();

export const authPageStyles: Record<string, SxProps<Theme>> = {
  pageContainer: {
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: "auto",
  },
  formContainer: {
    // width: '100%',
    maxWidth: "380px",
    margin: { xs: "16px", sm: "auto" },
    padding: { xs: "12px", sm: "16px" },
    flex: "none",
  },
  paper: {
    p: { xs: 2, sm: 3 },
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    minHeight: {
      xs: "450px",
      sm: "480px",
    },
    display: "flex",
    flexDirection: "column",
    position: "relative",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    borderRadius: 2,
  },
  registerPaper: {
    minHeight: {
      xs: "520px",
      sm: "550px",
    },
  },
};
