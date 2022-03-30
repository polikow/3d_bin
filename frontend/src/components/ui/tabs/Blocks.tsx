import React, {useState} from "react";
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
import Floater from "../Floater";
import SimplePaper from "../SimplePaper";
import MenuTitle from "../MenuTitle";
import {integerInBounds, Event} from "../../../utils";
import ButtonAccept from "../ButtonAccept";
import ButtonAdd from "../ButtonAdd";
import ButtonCreate from "../ButtonCreate";
import {Block} from "../../../wailsjs/go/models"

const rowsPerPage = 10

interface BlocksProps {
  open: boolean
  onClose: () => void
}

export default ({open, onClose}: BlocksProps) => {
  const blocks = useStore(s => s.blocks)
  const replaceBlocks = useStore(s => s.replaceBlocks)
  const addNewBlock = useStore(s => s.addNewBlock)
  const removeBlockByIndex = useStore(s => s.removeBlockByIndex)
  const changeBlockByIndex = useStore(s => s.changeBlockByIndex)
  const generateRandomBlocks = useStore(s => s.generateRandomBlocks)

  const [indexChanging, setIndexChanging] = useState<number | null>(null)

  const [page, setPage] = useState(0)

  const isChanging = indexChanging !== null

  return (
    <Floater open={open} onClose={onClose}>
      <SimplePaper className="blocks-table-paper">
        <MenuTitle title="Размеры грузов"/>
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
                            onChange={(index, block) => {
                              setIndexChanging(null)
                              changeBlockByIndex(index, block)
                            }}
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
          onPageChange={(event, newPage) => setPage(newPage)}
        />

        <div id="add-generate-buttons">
          <ButtonAdd title="Добавить новый груз"
                     disabled={isChanging}
                     onClick={() => addNewBlock({w: 1, h: 1, l: 1})}/>
          <Button variant="contained" color="primary"
                  onClick={() => replaceBlocks([])}>
            Удалить все грузы
          </Button>

          <Button variant="contained" color="primary"
                  onClick={() => generateRandomBlocks()}>
            Сенерировать случайные грузы
          </Button>
        </div>

      </SimplePaper>
    </Floater>
  )
}

interface ChangeMenuProps {
  index: number
  onChange: (index: number) => void
  onRemove: (index: number) => void
}

function ChangeMenu({index, onChange, onRemove}: ChangeMenuProps) {
  const [anchorEl, setAnchorEl] = useState(null)

  // @ts-ignore
  const openMenu = (event) => setAnchorEl(event.currentTarget)
  const closeMenu = () => setAnchorEl(null)
  const changeItem = () => {
    closeMenu()
    onChange(index)
  }
  const removeItem = () => {
    closeMenu()
    onRemove(index)
  }

  return <>
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

  const handleBlockChange = (side: "w" | "h" | "l") => (event: Event) => {
    const value = integerInBounds(event, 1, 1, 1000000)
    if (block[side] === value) return
    setBlock({...block, [side]: value})
  }

  return (
    <TableRow key={index}>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={block.w} onChange={handleBlockChange("w")}/>
      </TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={block.h} onChange={handleBlockChange("h")}/>
      </TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={block.l} onChange={handleBlockChange("l")}/>
      </TableCell>
      <TableCell>
        <ButtonAccept onClick={() => onChange(index, block)}/>
      </TableCell>
    </TableRow>
  )
}