import React     from "react";
import Floater, {FloaterPosition} from "./Floater";
import MenuPaper from "./MenuPaper";

interface TabProps {
  title: string
  open: boolean
  onClose: () => void
  position?: FloaterPosition
  children: React.ReactNode
}

export default ({title, open, onClose, position, children}: TabProps) => (
  <Floater open={open} onClose={onClose} position={position}>
    <MenuPaper title={title}>
      {children}
    </MenuPaper>
  </Floater>
)