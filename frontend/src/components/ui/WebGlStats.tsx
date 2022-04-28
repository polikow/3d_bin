import {useEffect} from "react"
import {addAfterEffect, addEffect} from "@react-three/fiber"
import StatsImpl from "stats.js"
import {useStore} from "../../store/store";

const stats = new StatsImpl()

let begin: () => void
let end: () => void

function mount() {
  stats.showPanel(0)
  document.body.appendChild(stats.dom)
  stats.dom.style.right = "0px"
  stats.dom.style.left = "initial"

  begin = addEffect(() => stats.begin())
  end = addAfterEffect(() => stats.end())
}

if (useStore.getState().isDebugMode) {
  mount()
}

function unmount() {
  document.body.removeChild(stats.dom)
  begin()
  end()
}

export default () => {
  useEffect(() => {
    useStore.subscribe(
      s => s.isDebugMode,
      isDebugMode => {
        if (isDebugMode) {
          mount()
        } else {
          if (stats === undefined) {
            return
          }
          unmount()
        }
      }
    )
  }, [])
  return null
}
