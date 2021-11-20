class WebrcadeScreenContext {
  constructor(webrcade, state) {
    this.webrcade = webrcade;

    webrcade.state = {
      ...webrcade.state,
      renderYesNoScreen: false,
      yesNoScreenProps: {},
      renderAddFeedScreen: false,
      renderAlertScreen: false
    }
  }

  getWebrcade() {
    return this.webrcade;
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

  showAlertScreen(open, message = "", onOk = null, showButton = true) {
    const { webrcade } = this;

    if (open) {
      webrcade.setState({
        renderAlertScreen: true,
        alertScreenProps: {
          message: message,
          onOk: onOk,
          showButton: showButton
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
      this.isYesNoScreenOpen()
    );
  }
}

export { WebrcadeScreenContext }