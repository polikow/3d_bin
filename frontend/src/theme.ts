import {green, indigo, red} from "@mui/material/colors";
import {createTheme} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500],
    },
    secondary: {
      main: red[500],
    },
    success: {
      main: green[300],
      light: green[200],
    }
  },
  typography: {
    button: {
      textTransform: "none",
    }
  }
})

export default theme