import {styled} from "@mui/material";

const HiddenLeft = styled("div")<{ open: boolean }>`
  ${({open}) => open ? "": "transform: translateX(-120%)"};
  
  transition: transform ${({theme}) => theme.transitions.duration.standard}ms 
  ${({open, theme}) => open ? theme.transitions.easing.easeOut : theme.transitions.easing.easeIn} 0ms;
`

export default HiddenLeft