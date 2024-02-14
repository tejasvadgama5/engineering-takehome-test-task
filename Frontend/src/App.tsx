import * as React from "react";
import axios from "axios";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import getLPTheme from "./getLPTheme";
import DataTable, { DisplayDataProps } from "./DataTable";

const baseURL = import.meta.env.VITE_API_URL

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});



export default function LandingPage() {
  const LPtheme = createTheme(getLPTheme("dark"));
  const [interpretationResult, setInterpretationResult] = React.useState<DisplayDataProps[]>();
  const [oruFile, setOruFile] = React.useState({ name: '' });
  const handleFileUpload = async (event: { target: { files: any[]; }; }) => {
    try {
      const file = event.target.files[0];
      setOruFile(file);
      const formData = new FormData();
      formData.append("oruFile", file);

      const response = await axios.post(
        `${baseURL}/upload-oru`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setInterpretationResult(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme: { palette: { mode: string; grey: any[]; }; }) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Typography component="h2" variant="h2" color="primary" gutterBottom>
            Engineering Takehome
          </Typography>
          <Grid spacing={3}>
            <Box component="section" sx={{ mt: 2, mb: 2 }}>
              <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {oruFile?.name || "Upload file"}
                <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
              </Button>
            </Box>
            {interpretationResult ? (
              interpretationResult?.length > 0 ? (
                <Box>
                  <Typography variant="h5">Abnormal Test Results:</Typography>
                  <DataTable data={interpretationResult} />
                </Box>
              ) : (
                <Typography variant="h5">No abnormal data found</Typography>
              )
            ) : (
              <Typography variant="h5">Please upload ORU file </Typography>
            )}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider >
  );
}
