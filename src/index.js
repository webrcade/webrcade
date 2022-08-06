import React from "react";
import ReactDOM from "react-dom";
import '@webrcade/app-common/dist/index.css'
import Webrcade from "./react/webrcade";

import {
  preloadImages,
} from '@webrcade/app-common'

preloadImages([
  "images/default-thumb.png",
]);

ReactDOM.render(
  <React.StrictMode>
    <Webrcade />
  </React.StrictMode>,
  document.getElementById("root")
);
