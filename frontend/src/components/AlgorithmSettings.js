import React, {useEffect, useState} from "react";
import {floatFromTextField, integerFromTextField, keepInBounds} from "../utils";
import {MenuItem, Select, TextField} from "@material-ui/core";

export default React.memo(({algorithm, onChange}) => {

  const [bcaSettings, setBCASettings] = useState({
    np: 10,
    ci: 2.76,
    ni: 500,
  })
  useEffect(() => console.log(bcaSettings), [bcaSettings])

  function handleBCAnpChange(event) {
    let newValue = keepInBounds(integerFromTextField(event, 1), 1, 10000)
    if (bcaSettings.np !== newValue)
      setBCASettings({...bcaSettings, np: newValue})
  }

  function handleBCAciChange(event) {
    let newValue = keepInBounds(floatFromTextField(event, 0.01), 0.01, 100)
    if (bcaSettings.ci !== newValue)
      setBCASettings({...bcaSettings, ci: newValue})
  }

  function handleBCAniChange(event) {
    let newValue = keepInBounds(integerFromTextField(event), 1, 10000)
    if (bcaSettings.ni !== newValue)
      setBCASettings({...bcaSettings, ni: newValue})
  }

  //***************************************************************************
  const [gaSettings, setGASettings] = useState({
    evolution: "Darwin",
    np: 100,
    mp: 0.21,
    ni: 500
  })
  const handleEvolutionChange = (event) => {
    const selectedEvolution = event.target.value
    setGASettings(prevState => ({...prevState, evolution: selectedEvolution}))
  }

  function handleGAnpChange(event) {
    let newValue = keepInBounds(integerFromTextField(event, 1), 1, 10000)
    if (gaSettings.np !== newValue)
      setGASettings({...gaSettings, np: newValue})
  }

  function handleGAmpChange(event) {
    let newValue = keepInBounds(floatFromTextField(event, 0.01), 0.01, 1)
    if (gaSettings.mp !== newValue)
      setGASettings({...gaSettings, mp: newValue})
  }

  function handleGAniChange(event) {
    let newValue = keepInBounds(integerFromTextField(event, 1), 1, 10000)
    if (gaSettings.ni !== newValue)
      setGASettings({...gaSettings, ni: newValue})
  }

  const getAppropriateSettings = () => {
    switch (algorithm) {
      case "bca":
        return bcaSettings
      case "ga":
        return gaSettings
      default:
        throw new Error()
    }
  }
  useEffect(function () {
    return onChange(getAppropriateSettings())
  }, [algorithm, bcaSettings, gaSettings]) // eslint-disable-line react-hooks/exhaustive-deps

  if (algorithm === "bca")
    return (
      <>
        <TextField type="number" className="text-field"
                   label="Количество антител в популяции"
                   InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
                   value={bcaSettings.np}
                   onChange={handleBCAnpChange}/>
        <TextField type="number" className="text-field"
                   label="Коэффициент интенсивности мутации"
                   InputProps={{inputProps: {min: 0.01, max: 100, step: 0.01}}}
                   value={bcaSettings.ci}
                   onChange={handleBCAciChange}/>
        <TextField type="number" className="text-field"
                   label="Количество итераций без улучшений"
                   InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
                   value={bcaSettings.ni}
                   onChange={handleBCAniChange}/>
      </>
    )

  if (algorithm === "ga")
    return (
      <>
        <Select className="selector"
                value={gaSettings.evolution} onChange={handleEvolutionChange}>
          <MenuItem value="Darwin">Модель эволюции Дарвина</MenuItem>
          <MenuItem value="deVries">Модель эволюции де Фриза</MenuItem>
        </Select>
        <TextField type="number" className="text-field"
                   label="Количество хросом в популяции"
                   InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
                   value={gaSettings.np}
                   onChange={handleGAnpChange}/>
        <TextField type="number" className="text-field"
                   label="Вероятность мутации"
                   InputProps={{inputProps: {min: 0.01, max: 1, step: 0.01}}}
                   value={gaSettings.mp}
                   onChange={handleGAmpChange}/>
        <TextField type="number" className="text-field"
                   label="Количество итераций без улучшений"
                   InputProps={{inputProps: {min: 1, max: 10000, step: 1}}}
                   value={gaSettings.ni}
                   onChange={handleGAniChange}/>
      </>
    )
})