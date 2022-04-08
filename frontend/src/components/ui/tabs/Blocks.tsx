import React, {useCallback, useState} from "react";
import {useStore} from "../../../store/store";
import {
  Button,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField
} from "@material-ui/core";
import {Event, integerInBounds} from "../../../utils";
import ButtonAccept from "../ButtonAccept";
import ButtonAdd from "../ButtonAdd";
import ButtonCreate from "../ButtonCreate";
import {Block} from "../../../wailsjs/go/models"
import {rowsPerPage} from "../../../consts";
import Tab from "../Tab";
import {compareStateSlices} from "../../../store/compare"

interface BlocksProps {
  open: boolean
  onClose: () => void
}

export default React.memo(({open, onClose}: BlocksProps) => {
  const [blocks] = useStore(s => [s.blocks], compareStateSlices)
  const [
    replaceBlocks, addNewBlock, removeBlockByIndex,
    changeBlockByIndex, generateRandomBlocks
  ] = useStore(s => [
      s.replaceBlocks, s.addNewBlock, s.removeBlockByIndex,
      s.changeBlockByIndex, s.generateRandomBlocks
    ],
    compareStateSlices
  )
  const [indexChanging, setIndexChanging] = useState<number | null>(null)
  const [page, setPage] = useState(0)

  const onPageChange = useCallback(
    (event, newPage) => setPage(newPage),
    [blocks]
  )
  const onChangeChangeableRow = useCallback(
    (index: number, block: Block) => {
      setIndexChanging(null)
      changeBlockByIndex(index, block)
    },
    []
  )
  const onClickButtonAdd = useCallback(() => addNewBlock({w: 1, h: 1, l: 1}), [])
  const onRemoveAllBlocks = useCallback(() => replaceBlocks([]), [])
  const onGenerateBlocks = useCallback(() => generateRandomBlocks(), [])

  const isChanging = indexChanging !== null

  return (
    <Tab title="Размеры грузов" className="blocks-table-paper" open={open} onClose={onClose}>
      <TableContainer>
        <Table stickyHeader className="blocks-table">
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
                          onRemove={removeBlockByIndex}
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
                          onRemove={removeBlockByIndex}
                          showChange={false}
                        />
                      )
                  }
                })
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[rowsPerPage]}
        rowsPerPage={rowsPerPage}
        page={page}
        count={blocks.length}
        onPageChange={onPageChange}
      />

      <div id="add-generate-buttons">
        <ButtonAdd  disabled={isChanging} onClick={onClickButtonAdd}>
          Добавить новый груз
        </ButtonAdd>
        <Button variant="contained" color="primary" onClick={onRemoveAllBlocks}>
          Удалить все грузы
        </Button>
        <Button variant="contained" color="primary" onClick={onGenerateBlocks}>
          Сенерировать случайные грузы
        </Button>
      </div>

    </Tab>
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
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={block.w} onChange={setWidth}/>
      </TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={block.h} onChange={setHeight}/>
      </TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={block.l} onChange={setLength}/>
      </TableCell>
      <TableCell>
        <ButtonAccept onClick={onClickButtonAccept}/>
      </TableCell>
    </TableRow>
  )
}