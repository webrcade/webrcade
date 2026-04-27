import React from "react";
import PromptScreen from '../../components/promptscreen';
import {
  ImageButton,
  // Resources,
  TextField,
  // TEXT_IDS,
} from '@webrcade/app-common'

require("./style.scss");

export default class SearchScreen extends PromptScreen {
  constructor() {
    super();
    this.overlayOpacity = 0.5;

    this.applyButtonRef = React.createRef();
    this.cancelButtonRef = React.createRef();
    this.searchFieldRef = React.createRef();

    this.focusGrid.setComponents([
      [this.searchFieldRef],
      [this.applyButtonRef, this.cancelButtonRef]
    ]);

    this.state = {
      count: null
    };
  }

  componentDidMount() {
    super.componentDidMount();
    const { searchFieldRef } = this;
    const { getCount, initialValue } = this.props;
    if (initialValue && searchFieldRef && searchFieldRef.current) {
      searchFieldRef.current.field.value = initialValue;
    }
    if (getCount) {
      this.setState({ count: getCount(initialValue || '') });
    }
  }

  focus() {
    const { searchFieldRef } = this;
    if (searchFieldRef && searchFieldRef.current) {
      searchFieldRef.current.focus();
    }
  }

  _doApply() {
    const { onApply } = this.props;
    const { searchFieldRef } = this;
    const { count } = this.state;
    if (count === 0) {
      this.close();
    } else if (onApply) {
      onApply(searchFieldRef.current.field.value);
    }
  }

  _doClear() {
    const { onClear } = this.props;
    if (onClear) {
      this.close();
      onClear();
    }
  }

  render() {
    return super.render({ overlayOpacity: 0.6 });
  }

  renderContent() {
    const { applyButtonRef, cancelButtonRef, focusGrid, searchFieldRef } = this;
    const { getCount, onSearch } = this.props;
    const { count } = this.state;

    const countSuffix = count === null ? '' :
      count === 0 ? ' (No items found)' :
      count === 1 ? ' (1 item found)' :
      ` (${count} items found)`;

    return (
      <>
        <div className={'search-screen-inner-content'}>
          <div className={'search-screen-inner-content-label'}>
            {'Search' + countSuffix}
          </div>
          <div className={'search-screen-inner-content-field'}>
            <form onSubmit={e => {
              e.preventDefault();
              this._doApply();
            }}>
              <TextField
                ref={searchFieldRef}
                width="35rem"
                placeholder=""
                onPad={e => focusGrid.moveFocus(e.type, searchFieldRef)}
                onChange={e => {
                  if (onSearch) onSearch(e.target.value);
                  if (getCount) this.setState({ count: getCount(e.target.value) });
                }}
              />
            </form>
          </div>
        </div>
        <div className='search-screen-inner-buttons'>
          <ImageButton
            ref={applyButtonRef}
            label={"Close"}
            onPad={e => focusGrid.moveFocus(e.type, applyButtonRef)}
            onClick={() => this._doApply()}
          />
          <ImageButton
            ref={cancelButtonRef}
            label={"Reset"}
            onPad={e => focusGrid.moveFocus(e.type, cancelButtonRef)}
            onClick={() => this._doClear()}
          />
        </div>
      </>
    );
  }
}
