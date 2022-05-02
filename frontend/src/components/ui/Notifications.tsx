import React, {useCallback, useEffect} from "react"
import useMap from "../../hooks/useMap";
import {styled} from "@mui/material";
import Floater from "./Floater";
import {EventsOn} from "../../wailsjs/runtime";
import Notification from "./Notification";

const NotificationsWrapper = styled("div")`
  display: flex;
  flex-flow: column;
`

export default React.memo(() => {
  const [setKeyValue, deleteByKey, getPairs] = useMap<string, [string, string, boolean]>()
  useEffect(() => {
    EventsOn("notification", data => {
      setKeyValue(data.key, [data.main, data.secondary, data.ok])
    })
  }, [])
  const onDone = useCallback(
    (key: string) => () => deleteByKey(key),
    [deleteByKey]
  )
  return (
    <Floater open flow="column" position="bottom-right">
      <NotificationsWrapper>
        {getPairs().map(([key, [main, secondary, ok]]) =>
          <Notification key={key} main={main} secondary={secondary} ok={ok} onDone={onDone(key)}/>
        )}
      </NotificationsWrapper>
    </Floater>
  )
})
