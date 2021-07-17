import React, {useState} from "react";
import {useStore} from "../store";
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
import Floater from "./ui/Floater";
import SimplePaper from "./ui/SimplePaper";
import MenuTitle from "./ui/MenuTitle";
import {integerFromTextField, keepInBounds} from "../utils";
import ButtonAccept from "./ui/ButtonAccept";
import ButtonAdd from "./ui/ButtonAdd";
import ButtonCreate from "./ui/ButtonCreate";
import {AppGenerateRandomBlocks} from "../bindings";
import {Close} from "@material-ui/icons";

const rowsPerPage = 10


export default ({open, onClose}) => {
  const [blocks, setBlocks] = useStore(s => [s.blocks, s.setBlocks])

  const handleRemoveHandler = (index) => {
    setBlocks(
      blocks.filter((_, i) => index !== i)
    )
  }

  const [indexChanging, setIndexChanging] = useState(null)
  const isChanging = indexChanging !== null
  const handleChangeHandler = (index) => {
    setIndexChanging(index)
  }

  const handleApplyChange = (index, w, h, l) => {
    setIndexChanging(null)
    setBlocks(
      blocks.map((block, i) => index === i
        ? [parseInt(w), parseInt(h), parseInt(l)]
        : block
      )
    )
  }

  const handleAddNewBlock = () => setBlocks([...blocks, [1, 1, 1]])

  const [page, setPage] = useState(0)
  const handlePageChange = (event, newPage) => setPage(newPage)

  const container = useStore(s => s.container)
  const handleGenerateBlocks = () => {
    AppGenerateRandomBlocks(container)
      .then(blocksObjects =>
        setBlocks(blocksObjects.map(block => [block.w, block.h, block.l])))
      .catch(console.error)
  }

  const handleRemoveAll = () => setBlocks([])

  return (
    <Floater open={open} onClose={onClose}>
      <SimplePaper classes={["blocks-table-paper"]}>
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
                  .map((size, i) => {
                    const index = i + page * rowsPerPage
                    if (indexChanging === null) {
                      return <Row key={index}
                                  index={index} size={size}
                                  onChange={handleChangeHandler}
                                  onRemove={handleRemoveHandler}/>
                    } else {
                      if (index === indexChanging) {
                        return <ChangeableRow key={index}
                                              index={index} size={size}
                                              onChange={handleApplyChange}/>
                      } else {
                        return <Row key={index}
                                    index={index} size={size}
                                    onChange={handleChangeHandler}
                                    onRemove={handleRemoveHandler}
                                    showChange={false}/>
                      }
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
          onPageChange={handlePageChange}
        />

        <div id="add-generate-buttons">
          <ButtonAdd disabled={isChanging} title="Добавить новый груз" onClick={handleAddNewBlock}/>

          <Button variant="contained" color="primary" onClick={handleRemoveAll}>
            Удалить все грузы
          </Button>

          <Button variant="contained" color="primary" onClick={handleGenerateBlocks}>
            Сенерировать случайные грузы
          </Button>
        </div>

      </SimplePaper>
    </Floater>
  )
}

function ChangeMenu({index, onChange, onRemove}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const onCloseClick = () => {
    setAnchorEl(null)
  }

  const onChangeClick = () => {
    setAnchorEl(null)
    onChange(index)
  }

  const onRemoveClick = () => {
    setAnchorEl(null)
    onRemove(index)
  }

  return <>
    <ButtonCreate onClick={openMenu}/>
    <Menu keepMounted
          anchorEl={anchorEl}
          open={anchorEl !== null}
          onClose={onCloseClick}
    >
      <MenuItem onClick={onChangeClick}>Изменить</MenuItem>
      <MenuItem onClick={onRemoveClick}>Удалить</MenuItem>
    </Menu>
  </>
}

function Row({index, size, onChange, onRemove, showChange = true}) {
  return (
    <TableRow key={index}>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="center">{size[0]}</TableCell>
      <TableCell align="center">{size[1]}</TableCell>
      <TableCell align="center">{size[2]}</TableCell>
      <TableCell>
        {showChange && (
          <ChangeMenu
            index={index}
            onChange={onChange}
            onRemove={onRemove}
          />
        )}
      </TableCell>
    </TableRow>
  )
}

function ChangeableRow({index, size: initialSize, onChange}) {

  const [size, setSize] = useState(initialSize)
  const handleSizeChange = (dimension) => (event) => {
    let newValue = keepInBounds(integerFromTextField(event, 1), 1, 1000000)
    if (size[dimension] !== newValue) {
      let newSize = [...size]
      newSize[dimension] = newValue
      setSize(newSize)
    }
  }

  const handleAccept = () => onChange(index, size[0], size[1], size[2])

  return (
    <TableRow key={index}>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={size[0]} onChange={handleSizeChange(0)}/>
      </TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={size[1]} onChange={handleSizeChange(1)}/>
      </TableCell>
      <TableCell align="center">
        <TextField type="number" className="blocks-table-changeable-cell"
                   value={size[2]} onChange={handleSizeChange(2)}/>
      </TableCell>
      <TableCell>
        <ButtonAccept onClick={handleAccept}/>
      </TableCell>
    </TableRow>
  )
}
