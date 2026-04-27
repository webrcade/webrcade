class WebrcadeScreenContext {
  constructor(webrcade, state) {
    this.webrcade = webrcade;

    webrcade.state = {
      ...webrcade.state,
      renderYesNoScreen: false,
      yesNoScreenProps: {},
      renderAddFeedScreen: false,
      renderAlertScreen: false,
      renderSettingsEditor: false,
      releaseNotes: false,
      renderSearchScreen: false,
      searchScreenProps: {},
    }
  }

  getWebrcade() {
    return this.webrcade;
  }

  showSettingsEditor(open) {
    const { webrcade } = this;
    webrcade.setState({
      renderSettingsEditor: open
    });
  }

  isSettingsEditorOpen() {
    const { webrcade } = this;
    return webrcade.state.renderSettingsEditor;
  }

  showReleaseNotes(open) {
    const { webrcade } = this;
    webrcade.setState({
      releaseNotes: open
    });
  }

  isReleaseNotesOpen() {
    const { webrcade } = this;
    return webrcade.state.releaseNotes;
  }

  showAddFeedScreen(open) {
    const { webrcade } = this;
    webrcade.setState({
      renderAddFeedScreen: open
    });
  }

  isAddFeedScreenOpen() {
    const { webrcade } = this;
    return webrcade.state.renderAddFeedScreen;
  }

  showAlertScreen(open, message = "", onOk = null, showButton = true, disableAnimation = false) {
    const { webrcade } = this;

    if (open) {
      webrcade.setState({
        renderAlertScreen: true,
        alertScreenProps: {
          message: message,
          onOk: onOk,
          showButton: showButton,
          disableAnimation: disableAnimation
        }
      });
    } else {
      webrcade.setState({
        renderAlertScreen: false
      });
    }
  }

  isAlertScreenOpen() {
    const { webrcade } = this;
    return webrcade.state.renderAlertScreen;
  }

  getAlertScreenProps() {
    const { webrcade } = this;
    return webrcade.state.alertScreenProps;
  }

  showYesNoScreen(open, message = "", onYes = null) {
    const { webrcade } = this;

    if (open) {
      webrcade.setState({
        renderYesNoScreen: true,
        yesNoScreenProps: {
          message: message,
          onYes: onYes
        }
      });
    } else {
      webrcade.setState({
        renderYesNoScreen: false
      });
    }
  }

  isYesNoScreenOpen() {
    const { webrcade } = this;
    return webrcade.state.renderYesNoScreen;
  }

  getYesNoScreenProps() {
    const { webrcade } = this;
    return webrcade.state.yesNoScreenProps;
  }

  showSearchScreen(open, props = {}) {
    const { webrcade } = this;
    webrcade.setState({
      renderSearchScreen: open,
      searchScreenProps: open ? props : {}
    });
  }

  isSearchScreenOpen() {
    const { webrcade } = this;
    return webrcade.state.renderSearchScreen;
  }

  getSearchScreenProps() {
    const { webrcade } = this;
    return webrcade.state.searchScreenProps;
  }

  showXboxBrowsingAlert() {
    this.showAlertScreen(true, (
      <div style={{ textAlign: 'center' }}>
        It appears that <b>Browsing Controls</b> are enabled<br /><br />
        Please use the controller's <b>Menu</b> button to switch to <b>Game Controls</b>
      </div>
    ));
  }

  isDialogOpen() {
    return (
      this.isAlertScreenOpen() ||
      this.isAddFeedScreenOpen() ||
      this.isYesNoScreenOpen() ||
      this.isSettingsEditorOpen() ||
      this.isReleaseNotesOpen() ||
      this.isSearchScreenOpen()
    );
  }
}

export { WebrcadeScreenContext }