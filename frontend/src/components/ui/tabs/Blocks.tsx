import React, {useCallback, useEffect, useState} from "react";
import {useStore} from "../../../store/store";
import {
  Button,
  Menu,
  MenuItem,
  styled,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@mui/material";
import {Event, integerInBounds} from "../../../utils";
import ButtonAccept from "../ButtonAccept";
import ButtonAdd from "../ButtonAdd";
import ButtonCreate from "../ButtonCreate";
import {Block} from "../../../wailsjs/go/models"
import {blocksPerRow, rowsPerPage} from "../../../consts";
import {compareAlwaysTrue, compareState} from "../../../store/compare"
import OuterPaper from "../OuterPaper";
import Title from "../Title";
import InnerPaper from "../InnerPaper";
import Floater from "../Floater";
import TableBody from "../TableBody";

interface BlocksProps {
  open: boolean
  onClose: () => void
}

const CustomInnerPaper = styled(InnerPaper)`
  padding: 0;
`

const CustomTablePagination = styled(TablePagination)`
  padding: 0;
`

const BottomButtonsWrapper = styled("div")`
  display: flex;
  flex-flow: column;
  margin: 0 10px 10px 10px;

  & > button {
    margin-top: 10px;
  }
`

export default React.memo(({open, onClose}: BlocksProps) => {
  const blocks = useStore(s => s.blocks, compareState)
  const [
    replaceBlocks, addNewBlock, removeBlockByIndex,
    changeBlockByIndex, generateRandomBlocks
  ] = useStore(s => [
      s.replaceBlocks, s.addNewBlock, s.removeBlockByIndex,
      s.changeBlockByIndex, s.generateRandomBlocks
    ],
    compareAlwaysTrue
  )
  const [indexChanging, setIndexChanging] = useState<number | null>(null)
  const [page, setPage] = useState(0)

  const onPageChange = useCallback(
    (event, newPage) => setPage(newPage),
    [blocks]
  )
  const onRowsPerPageChange = useCallback(() => setPage(0), [])
  const onChangeChangeableRow = useCallback(
    (index: number, block: Block) => {
      setIndexChanging(null)
      changeBlockByIndex(index, block)
    },
    []
  )
  const onClickButtonAdd = useCallback(() => addNewBlock({w: 1, h: 1, l: 1}), [])
  const onRemoveAllBlocks = useCallback(
    () => {
      replaceBlocks([])
      setPage(0)
    },
    []
  )
  const onGenerateBlocks = useCallback(
    () => {
      generateRandomBlocks()
      setPage(0)
    },
    []
  )
  const removeBlockAtIndex = useCallback(
    (index: number) => {
      removeBlockByIndex(index)
      const maxPageAfterRemoval = Math.max(Math.ceil((blocks.length - 1) / rowsPerPage) - 1, 0)
      const pageOfRemovedBlock = Math.floor(index / blocksPerRow)
      if (pageOfRemovedBlock > maxPageAfterRemoval) {
        setPage(prevPage => prevPage - 1)
      }
    },
    [blocks]
  )
  // переключается на 1ю страницу в том случае, если грузы изменились при закрытой вкладке
  useEffect(() => {
    if (!open && page !== 0) {
      setPage(0)
    }
  }, [blocks])

  return (
    <Floater open={open} onClose={onClose}>
      <OuterPaper elevation={3}>
        <Title>Размеры грузов</Title>
        <CustomInnerPaper elevation={0}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>№</TableCell>
                  <TableCell>Ширина</TableCell>
                  <TableCell>Высота</TableCell>
                  <TableCell>Длина</TableCell>
                  <TableCell> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  blocks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((block, i) => {
                      const index = i + page * rowsPerPage
                      switch (true) {
                        case (indexChanging === null):
                          return (
                            <Row
                              key={index}
                              index={index} block={block}
                              onChange={setIndexChanging}
                              onRemove={removeBlockAtIndex}
                            />
                          )
                        case (index === indexChanging):
                          return (
                            <ChangeableRow
                              key={index}
                              index={index} initialBlock={block}
                              onChange={onChangeChangeableRow}
                            />
                          )
                        default:
                          return (
                            <Row
                              key={index}
                              index={index} block={block}
                              onChange={setIndexChanging}
                              onRemove={removeBlockAtIndex}
                              showChange={false}
                            />
                          )
                      }
                    })
                }
                <TableRow>
                  <CustomTablePagination
                    rowsPerPageOptions={[rowsPerPage]}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    count={blocks.length}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                  />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <BottomButtonsWrapper>
            <ButtonAdd disabled={indexChanging !== null} onClick={onClickButtonAdd}>
              Добавить новый груз
            </ButtonAdd>
            <Button variant="contained" color="primary" onClick={onRemoveAllBlocks}>
              Удалить все грузы
            </Button>
            <Button variant="contained" color="primary" onClick={onGenerateBlocks}>
              Сенерировать случайные грузы
            </Button>
          </BottomButtonsWrapper>
        </CustomInnerPaper>
      </OuterPaper>
    </Floater>
  )
})

interface ChangeMenuProps {
  index: number
  onChange: (index: number) => void
  onRemove: (index: number) => void
}

function ChangeMenu({index, onChange, onRemove}: ChangeMenuProps) {
  const [anchorEl, setAnchorEl] = useState(null)

  const openMenu = useCallback((event) => setAnchorEl(event.currentTarget), [])
  const closeMenu = useCallback(() => setAnchorEl(null), [])
  const changeItem = useCallback(
    () => {
      closeMenu()
      onChange(index)
    },
    [index, onChange]
  )
  const removeItem = useCallback(
    () => {
      closeMenu()
      onRemove(index)
    },
    [index, onRemove]
  )

  return (
    <>
      <ButtonCreate onClick={openMenu}/>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={closeMenu}
      >
        <MenuItem onClick={changeItem}>Изменить</MenuItem>
        <MenuItem onClick={removeItem}>Удалить</MenuItem>
      </Menu>
    </>
  )
}

interface RowProps {
  index: number
  block: Block
  onChange: (index: number) => void
  onRemove: (index: number) => void
  showChange?: boolean
}

function Row({index, block, onChange, onRemove, showChange = true}: RowProps) {
  return (
    <TableRow key={index}>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="center">{block.w}</TableCell>
      <TableCell align="center">{block.h}</TableCell>
      <TableCell align="center">{block.l}</TableCell>
      <TableCell>
        {showChange &&
          <ChangeMenu
            index={index}
            onChange={onChange}
            onRemove={onRemove}
          />
        }
      </TableCell>
    </TableRow>
  )
}

interface ChangeableRowProps {
  index: number
  initialBlock: Block
  onChange: (index: number, block: Block) => void
}

const CustomTextField = styled(TextField)`
  width: 63px;
`

function ChangeableRow({index, initialBlock, onChange}: ChangeableRowProps) {
  const [block, setBlock] = useState(initialBlock)

  const setBlockSide = useCallback(
    (side: "w" | "h" | "l") => (event: Event) => {
      const value = integerInBounds(event, 1, 1, 1000000)
      if (block[side] === value) return
      setBlock({...block, [side]: value})
    },
    [block]
  )
  const setWidth = useCallback(setBlockSide("w"), [setBlockSide])
  const setHeight = useCallback(setBlockSide("h"), [setBlockSide])
  const setLength = useCallback(setBlockSide("l"), [setBlockSide])
  const onClickButtonAccept = useCallback(
    () => onChange(index, block),
    [index, block]
  )

  return (
    <TableRow key={index}>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="center">
        <CustomTextField variant="standard" type="number"
                   value={block.w} onChange={setWidth}/>
      </TableCell>
      <TableCell align="center">
        <CustomTextField variant="standard" type="number"
                   value={block.h} onChange={setHeight}/>
      </TableCell>
      <TableCell align="center">
        <CustomTextField variant="standard" type="number"
                   value={block.l} onChange={setLength}/>
      </TableCell>
      <TableCell>
        <ButtonAccept onClick={onClickButtonAccept}/>
      </TableCell>
    </TableRow>
  )
}