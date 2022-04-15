import {useEffect, useState} from "react"
import {addAfterEffect, addEffect} from "@react-three/fiber"
import StatsImpl from "stats.js"

interface WebGlStatsProps {
  parent?: any // TODO fix
  showPanel?: number
}

export function WebGlStats({parent, showPanel = 0}: WebGlStatsProps) {
  const [stats] = useState(() => new StatsImpl())
  useEffect(() => {
    const node = (parent && parent.current) || document.body

    stats.showPanel(showPanel)
    node.appendChild(stats.dom)

    stats.dom.style.right = "0px"
    stats.dom.style.left = "initial"

    const begin = addEffect(() => stats.begin())
    const end = addAfterEffect(() => stats.end())

    return () => {
      node.removeChild(stats.dom)
      begin()
      end()
    }
  }, [parent])
  return null
}
