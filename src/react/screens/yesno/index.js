import React from "react";
import PromptScreen from '../../components/promptscreen'
import { ImageButton, Resources, TEXT_IDS } from '@webrcade/app-common'

require("./style.scss");

export default class YesNoScreen extends PromptScreen {
  constructor() {
    super();

    this.yesButtonRef = React.createRef();
    this.noButtonRef = React.createRef();

    this.focusGrid.setComponents([
      [this.yesButtonRef, this.noButtonRef]
    ]);

    this.state = {};
  }

  focus() {
    const { noButtonRef } = this;
    if (noButtonRef && noButtonRef.current) {
      noButtonRef.current.focus();
    }
  }

  renderContent() {
    const { focusGrid, noButtonRef, yesButtonRef } = this;
    const { message, onYes } = this.props;

    return (
      <>
        <div className={'yesno-screen-inner-content'}>
          <div className={'yesno-screen-inner-content-label'}>{message}</div>
        </div>
        <div className='yesno-screen-inner-buttons'>
          <ImageButton
            ref={yesButtonRef}
            label={Resources.getText(TEXT_IDS.YES)}
            onPad={e => focusGrid.moveFocus(e.type, yesButtonRef)}
            onClick={() => {if (onYes) onYes(this)}}
          />
          <ImageButton
            ref={noButtonRef}
            label={Resources.getText(TEXT_IDS.NO)}
            onPad={e => focusGrid.moveFocus(e.type, noButtonRef)}
            onClick={() => this.close()}
          />
        </div>
      </>
    );
  }
}

