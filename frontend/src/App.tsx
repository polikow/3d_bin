import React from 'react';
import {ThemeProvider} from "@mui/material";
import UI from "./components/ui/UI";
import Canvas3D from "./components/canvas/Canvas3D";
import theme from "./theme";

export default () => (
  <>
    <ThemeProvider theme={theme}>
      <UI/>
    </ThemeProvider>
    <Canvas3D/>
  </>
)
