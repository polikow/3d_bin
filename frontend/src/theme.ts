import {indigo, red} from "@mui/material/colors";
import {createTheme} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: indigo[500]
    },
    secondary: {
      main: red[500]
    }
  }
})

export default theme