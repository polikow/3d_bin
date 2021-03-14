import React from 'react';
import './App.css';
import 'fontsource-roboto';
import UI from "./components/UI";
import Canvas3D from "./components/Canvas3D";

export default () => (
  <div id="app" className="App">
    <UI/>
    <Canvas3D/>
  </div>
)
