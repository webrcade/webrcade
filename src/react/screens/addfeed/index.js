import React from "react";
import PromptScreen from '../../components/promptscreen';
import { storage } from '../../../storage';
import {
  ImageButton,
  Resources,
  TextField,
  // AddCircleBlackImage,
  // AddCircleWhiteImage,
  LOG,
  TEXT_IDS
} from '@webrcade/app-common'

require("./style.scss");

export default class AddFeedScreen extends PromptScreen {
  constructor() {
    super();

    this.addButtonRef = React.createRef();
    this.cancelButtonRef = React.createRef();
    this.locationFieldRef = React.createRef();

    this.focusGrid.setComponents([
      [this.locationFieldRef],
      [this.addButtonRef, this.cancelButtonRef]
    ]);

    this.state = {};
  }

  SCREEN_PROP_PREFIX = "addScreen.";
  LAST_URL_PROP = this.SCREEN_PROP_PREFIX + "lastUrl";

  focus() {
    const { locationFieldRef } = this;
    if (locationFieldRef && locationFieldRef.current) {
      locationFieldRef.current.focus();
    }
  }

  componentDidMount() {
    super.componentDidMount();
    const { locationFieldRef, LAST_URL_PROP } = this;
    storage.get(LAST_URL_PROP)
      .then( val => {
        if (val) {
          locationFieldRef.current.field.value = val;
        }
      })
      .catch(e => LOG.error(e))
  }

  _onAdd() {
    const { locationFieldRef, LAST_URL_PROP } = this;
    const { onAdd } = this.props;

    // Store last value
    const val = locationFieldRef.current.field.value.trim();
    storage.put(LAST_URL_PROP, val).catch(e => LOG.error(e));
    onAdd(this, val);    
  }

  renderContent() {
    const {
      addButtonRef,
      cancelButtonRef,
      focusGrid,
      locationFieldRef      
    } = this;

    return (
      <>
        <div className={'addfeed-screen-inner-content'}>
          <div className={'addfeed-screen-inner-content-label'}>
            {Resources.getText(TEXT_IDS.SPECIFY_LOCATION_OF_FEED)}
          </div>
          <div className={'addfeed-screen-inner-content-field'}>
            <form onSubmit={(e) => {
              e.preventDefault();
              this._onAdd();
            }}>
              <TextField
                ref={locationFieldRef}
                width="35rem"
                onPad={e => focusGrid.moveFocus(e.type, locationFieldRef)}
              />
            </form>
          </div>
        </div>
        <div className='addfeed-screen-inner-buttons'>
          <ImageButton
            ref={addButtonRef}
            //label={Resources.getText(TEXT_IDS.ADD)}
            label={Resources.getText(TEXT_IDS.OK)}
            // imgSrc={AddCircleBlackImage}
            // hoverImgSrc={AddCircleWhiteImage}
            onPad={e => focusGrid.moveFocus(e.type, addButtonRef)}
            onClick={() => this._onAdd()}
          />
          <ImageButton
            ref={cancelButtonRef}
            label={Resources.getText(TEXT_IDS.CANCEL)}
            onPad={e => focusGrid.moveFocus(e.type, cancelButtonRef)}
            onClick={() => this.close()}
          />
        </div>
      </>
    );
  }
}

