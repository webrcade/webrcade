import React from "react";
import {
  ImageButton,
  Switch,
  Resources,
  Screen,
  WebrcadeContext,
  ReleaseData,
  TEXT_IDS
} from '@webrcade/app-common';

require("./style.scss");

export default class ReleaseNotesScreen extends Screen {
  constructor(props) {
    super(props);

    this.contentRef = React.createRef();
    this.dontShowSwitchRef = React.createRef();
    this.okButtonRef = React.createRef();
    this.analogCallback = null;

    this.focusGrid.setComponents([
      [this.dontShowSwitchRef, this.okButtonRef],
    ]);

    this.state = {
      dontshow: false
    };
  }

  componentDidMount() {
    super.componentDidMount();

    const { gamepadNotifier } = this;

    if (!this.analogCallback && gamepadNotifier) {
      this.analogCallback = (e) => {
        if (e.type === 'r_analog_y') {
          const el = this.contentRef.current;
          if (el) {
            const height = el.scrollHeight - el.clientHeight;
            let adjust = el.scrollTop + (e.value * 40);

            if (adjust < 0) adjust = 0;
            else if (adjust > height) adjust = height;

            el.scrollTop = adjust;
          }
        }
      };

      gamepadNotifier.addAnalogCallback(this.analogCallback);
    }
  }

  componentWillUnmount() {
    const { gamepadNotifier } = this;

    if (this.analogCallback && gamepadNotifier) {
      gamepadNotifier.removeAnalogCallback(this.analogCallback);
    }
  }

  focus() {
    if (this.okButtonRef.current) {
      this.okButtonRef.current.focus();
    }
  }

  parseText(text) {
    const parts = text.split(/\*(.*?)\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
  }

  renderChange(change, index) {
    if (typeof change === 'string') {
      return (
        <li key={index} className="change-item">
          {this.parseText(change)}
        </li>
      );
    }

    return (
      <li key={index} className="change-item">
        {this.parseText(change.title)}
        <ul className="sub-change-list">
          {change.items.map((item, si) => (
            <li key={si} className="sub-change-item">
              {this.parseText(item)}
            </li>
          ))}
        </ul>
      </li>
    );
  }

  render() {
    let { notes, onClose } = this.props;
    const { focusGrid, okButtonRef, dontShowSwitchRef, screenContext, screenStyles } = this;

    notes = ReleaseData;

    return (
      <WebrcadeContext.Provider value={screenContext}>
        <div className={screenStyles['screen-transparency']}/>
        <div className="release-screen-dialog">
          <div className="release-screen-heading">
            WEBЯCADE UPDATED
          </div>

          <div className="release-screen-content" ref={this.contentRef}>
            {notes.map((note, noteIndex) => (
              <div key={note.version} className={`release-item${noteIndex > 0 ? ' release-item-divider' : ''}`}>
                <div className="release-meta">
                  <span className="release-version">{note.version}</span>
                  <span>•</span>
                  <span className="release-date">{note.date}</span>
                  {note.preRelease && (
                    <span className="release-pre-badge">Pre-Release</span>
                  )}
                </div>

                <div className="release-title">{note.title}</div>

                {note.image && (
                  <img className="release-image" src={note.image} alt="" />
                )}

                <ul className="change-list">
                  {note.changes.map((change, i) =>
                    this.renderChange(change, i)
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="release-screen-buttons">
            <div class="release-buttons-left-group">
              <Switch
                ref={dontShowSwitchRef}
                onPad={e => focusGrid.moveFocus(e.type, dontShowSwitchRef)}
                onChange={(e) => {this.setState({dontshow: e.target.checked})}}
                checked={this.state.dontshow}
              />
              <div className="dont-show-again-text">Don't show again</div>
            </div>
            <div class="release-buttons-centered">
              <ImageButton
                ref={okButtonRef}
                label={Resources.getText(TEXT_IDS.OK)}
                onPad={e => focusGrid.moveFocus(e.type, okButtonRef)}
                onClick={() => onClose(this.state.dontshow)}
              />
            </div>
          </div>
        </div>
      </WebrcadeContext.Provider>
    );
  }
}
