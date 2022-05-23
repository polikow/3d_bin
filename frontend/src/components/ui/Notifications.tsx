import React, {useCallback, useEffect} from "react"
import useMap from "../../hooks/useMap";
import {styled} from "@mui/material";
import {EventsOn} from "../../../wailsjs/runtime";
import Notification from "./Notification";

const NotificationsWrapper = styled("div")`
  position: fixed;
  bottom: 0;
  right: 0;

  display: flex;
  flex-flow: column;
  align-items: end;

  z-index: 10;
`

export default React.memo(() => {
  const [setKeyValue, deleteByKey, getPairs] = useMap<string, [string, string, boolean]>()
  useEffect(() => {
    EventsOn("notification", data => {
      setKeyValue(data.key, [data.main, data.secondary, data.ok])
    })
  }, [])
  const onDone = useCallback(
    (key: string) => deleteByKey(key),
    [deleteByKey]
  )
  return (
      <NotificationsWrapper>
        {getPairs().map(([key, [main, secondary, ok]]) =>
          <Notification
            key={key} id={key}
            main={main} secondary={secondary} ok={ok}
            onDone={onDone}
          />
        )}
      </NotificationsWrapper>
  )
})
