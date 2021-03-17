import React, {useEffect, useState} from "react";
import {changeStateObj} from "../utils";
import {TextField} from "@material-ui/core";

export default React.memo(({algorithm, onChange}) => {

  const [aisSettings, setAISSettings] = useState({
    np: 5,
    ci: 1,
    ni: 250,
  })
  const changeAISSettings = (option) => (event) => {
    const value = typeof event.target.value === "string"
      ? parseInt(event.target.value)
      : event.target.value
    const [newState, changed] = changeStateObj(aisSettings)(option)(value)
    if (changed) {
      setAISSettings(newState)
    }
  }

  const [gaSettings, setGASettings] = useState({n: 2})
  const changeGASettings = (option) => (event) => {
    const value = typeof event.target.value === "string"
      ? parseInt(event.target.value)
      : event.target.value
    const [newState, changed] = changeStateObj(gaSettings)(option)(value)
    if (changed) {
      setGASettings(newState)
    }
  }

  const getAppropriateSettings = () => {
    switch (algorithm) {
      case "ais":
        return aisSettings
      case "ga":
        return gaSettings
      default:
        throw new Error()
    }
  }
  useEffect(function () {
    return onChange(getAppropriateSettings())
  }, [algorithm, aisSettings, gaSettings]) // eslint-disable-line react-hooks/exhaustive-deps

  switch (algorithm) {
    case "ais":
      return (
        <>
          <TextField type="number" className="text-field"
                     label="Количество антител в популяции"
                     value={aisSettings.np}
                     onChange={changeAISSettings("n")}/>
          <TextField type="number" className="text-field"
                     label="Коэффициент интенсивности мутации"
                     value={aisSettings.ci}
                     onChange={changeAISSettings("ci")}/>
          <TextField type="number" className="text-field"
                     label="Количество итераций без улучшений"
                     value={aisSettings.ni}
                     onChange={changeAISSettings("ni")}/>
        </>
      )
    case "ga":
      return (<>n{changeGASettings.toString()[0]}t implemented</>)
    default:
      throw new Error()
  }
})