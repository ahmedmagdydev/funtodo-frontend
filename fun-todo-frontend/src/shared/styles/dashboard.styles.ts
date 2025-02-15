import { SxProps, Theme } from "@mui/material";

export const dashboardStyles: Record<string, SxProps<Theme>> = {
  container: {
    padding: 3,
    minHeight: "100vh",
    backgroundColor: "background.default",
  },
  header: {
    marginBottom: 3,
  },
  controls: {
    marginBottom: 3,
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
  },
  formControl: {
    minWidth: 120,
  },
  gridItem: {
    height: "100%",
  },
  paper: {
    padding: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  chartContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
