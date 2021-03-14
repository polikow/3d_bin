import React from "react";
import {useStore} from "../store";
import Floater from "./ui/Floater";
import SimplePaper from "./ui/SimplePaper";
import MenuTitle from "./ui/MenuTitle";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

export default ({open, onClose}) => {

  const packed = useStore(s => s.packed)

  return (
    <Floater open={open} onClose={onClose}>
      <SimplePaper>
        <MenuTitle title="Позиции грузов"/>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>X1</TableCell>
              <TableCell>Y1</TableCell>
              <TableCell>Z1</TableCell>
              <TableCell>X2</TableCell>
              <TableCell>Y2</TableCell>
              <TableCell>Z2</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packed.map(({p1, p2}, i) => (
              <TableRow key={i.toString()}>
                <TableCell align="center">{i + 1}</TableCell>
                <TableCell align="center">{p1.x}</TableCell>
                <TableCell align="center">{p1.y}</TableCell>
                <TableCell align="center">{p1.z}</TableCell>
                <TableCell align="center">{p2.x}</TableCell>
                <TableCell align="center">{p2.y}</TableCell>
                <TableCell align="center">{p2.z}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SimplePaper>
    </Floater>
  );
}