import React from "react";
import ReactDOM from "react-dom";
import '@webrcade/app-common/dist/index.css'
import Webrcade from "./react/webrcade";

import { 
  preloadImages,
  AddCircleBlackImage,
  AddCircleWhiteImage,
  CloudDownloadBlackImage,
  CloudDownloadWhiteImage,
  DeleteForeverBlackImage,
  DeleteForeverWhiteImage,
  PlayArrowBlackImage,
  PlayArrowWhiteImage,
  WebrcadeLogoDarkImage,
  WebrcadeLogoLargeImage  
} from '@webrcade/app-common'

preloadImages([
  WebrcadeLogoDarkImage,
  WebrcadeLogoLargeImage,
  AddCircleBlackImage,
  AddCircleWhiteImage,
  CloudDownloadBlackImage,
  CloudDownloadWhiteImage,
  DeleteForeverBlackImage,
  DeleteForeverWhiteImage,
  PlayArrowBlackImage,
  PlayArrowWhiteImage
]);

ReactDOM.render(
  <React.StrictMode>
    <Webrcade />
  </React.StrictMode>,
  document.getElementById("root")
);
