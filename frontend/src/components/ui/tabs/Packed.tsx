import React, {useCallback, useState} from "react";
import {useStore} from "../../../store/store";
import Floater from "../Floater";
import Title from "../Title";
import {styled, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
import {Rotation} from "../../../store/types";
import {rowsPerPage} from "../../../consts";
import OuterPaper from "../OuterPaper";
import InnerPaper from "../InnerPaper";

interface PackedProps {
  open: boolean
  onClose: () => void
}

const CustomInnerPaper = styled(InnerPaper)`
  padding: 0;
`

const Packed = React.memo(({open, onClose}: PackedProps) => {
  const [page, setPage] = useState(0)
  const [packed, solution,] = useStore(
    s => [s.searchResult.packed, s.searchResult.solution, s.searchResult.value],
    ([, , prevValue], [, , nextValue]) => {
      // переключается на 1ю страницу в том случае, если контент изменился при закрытой вкладке
      if (!open && prevValue !== nextValue && page !== 0) {
        setPage(0)
      }
      // prevents render when it is not visible
      return open ? prevValue === nextValue : true
    }
  )
  const handlePageChange = useCallback(
    (_, newPage: number) => setPage(newPage),
    []
  )
  return (
    <Floater open={open} onClose={onClose}>
      <OuterPaper elevation={3}>
        <Title>Позиции упакованных грузов</Title>
        <CustomInnerPaper elevation={0}>
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
                    const rotation = Rotation[solution[j].rotation]
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
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[rowsPerPage]}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    count={packed.length}
                    onPageChange={handlePageChange}
                  />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CustomInnerPaper>
      </OuterPaper>
    </Floater>
  )
})

export default Packed