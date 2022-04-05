package packing

// Axis - одна из трех осей пространства.
//  Ось X направлена на восток.
//  Ось Y направлена вверх.
//  Ось Z направлена на юг.
type Axis byte

const (
	X = iota
	Y
	Z
)
