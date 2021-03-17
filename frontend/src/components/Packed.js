import React, {useState} from "react";
import {useStore} from "../store";
import Floater from "./ui/Floater";
import SimplePaper from "./ui/SimplePaper";
import MenuTitle from "./ui/MenuTitle";
import {Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@material-ui/core";

const rowsPerPage = 10


export default ({open, onClose}) => {

  const packed = useStore(s => s.packed)

  const [page, setPage] = useState(0)
  const handleChangePage = (event, newPage) => setPage(newPage)

  return (
    <Floater open={open} onClose={onClose}>
      <SimplePaper>
        <MenuTitle title="Позиции грузов"/>
        <TableContainer>
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
              {packed
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(({p1, p2}, i) => {
                  const index = i + page * rowsPerPage
                  return (
                    <TableRow key={index.toString()}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{p1.x}</TableCell>
                      <TableCell align="center">{p1.y}</TableCell>
                      <TableCell align="center">{p1.z}</TableCell>
                      <TableCell align="center">{p2.x}</TableCell>
                      <TableCell align="center">{p2.y}</TableCell>
                      <TableCell align="center">{p2.z}</TableCell>
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