import {useCallback, useState} from "react";

type UseMapActions<K, V> = [
  setKeyValue: (key: K, value: V) => void,
  deleteByKey: (key: K) => void,
  getPairs: () => [K, V][]
]

function useMap<K, V>(initialState: Map<K, V> = new Map()): UseMapActions<K, V> {
  const [map, setMap] = useState(initialState)

  const setKeyValue = useCallback(
    (key, value) => {
      setMap((aMap) => {
        const copy = new Map(aMap)
        return copy.set(key, value)
      });
    },
    []
  )
  const deleteByKey = useCallback(
    (key) => {
      setMap((_map) => {
        const copy = new Map(_map)
        copy.delete(key)
        return copy
      })
    },
    []
  )
  const getPairs = useCallback(() =>
      [...map.entries()],
    [map]
  )
  return [setKeyValue, deleteByKey, getPairs]
}

export default useMap