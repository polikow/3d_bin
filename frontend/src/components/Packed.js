import React, {useState} from "react";
import {useStore} from "../store";
import Floater from "./ui/Floater";
import SimplePaper from "./ui/SimplePaper";
import MenuTitle from "./ui/MenuTitle";
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@material-ui/core";
import {rotations} from "../utils";

const rowsPerPage = 10

export default ({open, onClose}) => {

  const packed = useStore(s => s.packed)
  const solution = useStore(s => s.solution)

  const [page, setPage] = useState(0)
  const handleChangePage = (event, newPage) => setPage(newPage)

  return (
    <Floater open={open} onClose={onClose}>
      <SimplePaper>
        <MenuTitle title="Позиции упакованных грузов"/>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>№ груза</TableCell>
                <TableCell>X</TableCell>
                <TableCell>Y</TableCell>
                <TableCell>Z</TableCell>
                <TableCell>Поворот</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packed
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(({p1, p2}, i) => {
                  const j = i + page * rowsPerPage
                  const index = solution[j].index
                  const rotation = rotations[solution[j].rotation]

                  return (
                    <TableRow key={index.toString()}>
                      <TableCell align="center">{j + 1}</TableCell>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{p1.x}</TableCell>
                      <TableCell align="center">{p1.y}</TableCell>
                      <TableCell align="center">{p1.z}</TableCell>
                      <TableCell align="center">{rotation}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[rowsPerPage]}
          rowsPerPage={rowsPerPage}
          page={page}
          count={packed.length}
          onChangePage={handleChangePage}
        />
      </SimplePaper>
    </Floater>
  );
}