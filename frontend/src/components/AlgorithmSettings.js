import React, {useEffect, useState} from "react";
import {changeStateObj} from "../utils";
import {MenuItem, Select, TextField} from "@material-ui/core";

export default React.memo(({algorithm, onChange}) => {

  const [bcaSettings, setBCASettings] = useState({
    np: 5,
    ci: 1,
    ni: 250,
  })
  const changeBCASettings = (option) => (event) => {
    const value = typeof event.target.value === "string"
      ? parseInt(event.target.value)
      : event.target.value
    const [newState, changed] = changeStateObj(bcaSettings)(option)(value)
    if (changed) {
      setBCASettings(newState)
    }
  }

  const [gaSettings, setGASettings] = useState({
    evolution: "Darwin",
    np: 100,
    mp: 0.1,
    ni: 200
  })
  const changeGASettings = (option) => (event) => {
    const value = typeof event.target.value === "string"
      ? parseInt(event.target.value)
      : event.target.value
    const [newState, changed] = changeStateObj(gaSettings)(option)(value)
    if (changed) {
      setGASettings(newState)
    }
  }
  const handleEvolutionChange = (event) => {
    const selectedEvolution = event.target.value
    setGASettings(prevState => ({
      ...prevState,
      evolution: selectedEvolution
    }))
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

  switch (algorithm) {
    case "bca":
      return (
        <>
          <TextField type="number" className="text-field"
                     label="Количество антител в популяции"
                     value={bcaSettings.np}
                     onChange={changeBCASettings("np")}/>
          <TextField type="number" className="text-field"
                     label="Коэффициент интенсивности мутации"
                     value={bcaSettings.ci}
                     onChange={changeBCASettings("ci")}/>
          <TextField type="number" className="text-field"
                     label="Количество итераций без улучшений"
                     value={bcaSettings.ni}
                     onChange={changeBCASettings("ni")}/>
        </>
      )
    case "ga":
      return (
        <>
          <Select className="selector"
            value={gaSettings.evolution} onChange={handleEvolutionChange}>
            <MenuItem value="Darwin">Модель эволюции Дарвина</MenuItem>
            <MenuItem value="deVries">Модель эволюции де Фриза</MenuItem>
          </Select>
          <TextField type="number" className="text-field"
                     label="Количество хросом в популяции"
                     value={gaSettings.np}
                     onChange={changeGASettings("np")}/>
          <TextField type="number" className="text-field"
                     label="Вероятность мутации"
                     value={gaSettings.mp}
                     onChange={changeGASettings("mp")}/>
          <TextField type="number" className="text-field"
                     label="Количество итераций без улучшений"
                     value={gaSettings.ni}
                     onChange={changeGASettings("ni")}/>
        </>
      )
    default:
      throw new Error()
  }
})