import React from "react";
import PromptScreen from '../../components/promptscreen'
import { ImageButton, Resources, TEXT_IDS } from '@webrcade/app-common'

require("../yesno/style.scss");

export default class AlertScreen extends PromptScreen {
  constructor() {
    super();

    this.okButtonRef = React.createRef();

    this.focusGrid.setComponents([
      [this.okButtonRef]
    ]);

    this.state = {};
  }

  focus() {
    const { okButtonRef } = this;
    if (okButtonRef && okButtonRef.current) {
      okButtonRef.current.focus();
    }
  }

  renderContent() {
    const { focusGrid, okButtonRef } = this;
    const { message, onOk, showButton } = this.props;
    const innerStyle = !showButton ? { display : 'none'} : null;
    const labelStyle = !showButton ? { marginBottom : 0} : null;

    return (
      <>
        <div className={'yesno-screen-inner-content'}>
          <div className={'yesno-screen-inner-content-label'} style={labelStyle}>{message}</div>
        </div>
        <div className='yesno-screen-inner-buttons' style={innerStyle}>
          <ImageButton
            ref={okButtonRef}
            label={Resources.getText(TEXT_IDS.OK)}
            onPad={e => focusGrid.moveFocus(e.type, okButtonRef)}
            onClick={() => {
              if (onOk) {
                onOk(this);
              } else {
                this.close();
              }
            }}
          />
        </div>
      </>
    );
  }
}

