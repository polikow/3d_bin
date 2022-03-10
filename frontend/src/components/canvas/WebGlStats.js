import {useEffect, useState} from "react"
import {addAfterEffect, addEffect} from "@react-three/fiber"
import StatsImpl from "stats.js"

export function WebGlStats({showPanel = 0, className, parent}) {
  const [stats] = useState(() => new StatsImpl())
  useEffect(() => {
    const node = (parent && parent.current) || document.body

    stats.showPanel(showPanel)
    node.appendChild(stats.dom)

    if (className) stats.dom.classList.add(className)

    const begin = addEffect(() => stats.begin())
    const end = addAfterEffect(() => stats.end())

    return () => {
      node.removeChild(stats.dom)
      begin()
      end()
    }
  }, [parent]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
