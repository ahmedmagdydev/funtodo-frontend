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
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 3,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 2,
    backdropFilter: "blur(10px)",
  },
  formTitle: {
    textAlign: "center",
    marginBottom: 3,
    color: "primary.main",
  },
  formField: {
    marginBottom: 2,
  },
  submitButton: {
    marginTop: 2,
    marginBottom: 1,
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    margin: "16px 0",
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    margin: "0 16px",
    color: "text.secondary",
  },
  googleButton: {
    marginTop: 1,
    marginBottom: 2,
  },
  linkText: {
    textAlign: "center",
  },
};
