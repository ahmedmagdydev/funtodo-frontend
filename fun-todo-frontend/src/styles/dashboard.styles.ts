import { SxProps, Theme } from "@mui/material";

export const dashboardStyles: Record<string, SxProps<Theme>> = {
  container: {
    p: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 2,
  },
  gridContainer: {
    flex: 1,
    overflowY: "auto",
    p: 2,
  },
  chartCard: {
    p: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1,
  },
};
