import React from "react";
import {styled, Typography} from "@mui/material";

interface TitleProps {
  children: React.ReactNode
}

const CustomTypography = styled(Typography)`
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  padding: 10px 15px;
  background: #3f51b5;
  border-radius: 4px 4px 0 0;
  color: white;
`

const Title = ({children}: TitleProps) => (
  <CustomTypography align="center">
    {children}
  </CustomTypography>
)

export default Title