import { Screen, WebrcadeContext } from '@webrcade/app-common'

require("./style.scss");

export default class PromptScreen extends Screen {
  renderContent() {
    return null;
  }

  render() {
    const { screenContext, screenStyles } = this;
    const { disableAnimation, height, overlayOpacity: overlayOpacityProp } = this.props;
    const overlayOpacity = this.overlayOpacity !== undefined ? this.overlayOpacity : overlayOpacityProp;

    const styles = {};
    if (height) {
      styles.height = height;
      if (disableAnimation) {
        styles.animation = 'none';
      }
    }

    const transparencyStyles = {}
    if (disableAnimation) {
      transparencyStyles.animation = 'none'
    }
    if (overlayOpacity !== undefined) {
      transparencyStyles.opacity = overlayOpacity;
      transparencyStyles.animation = 'none';
    }

    return (
      <WebrcadeContext.Provider value={screenContext}>
        <div className={screenStyles['screen-transparency']} style={transparencyStyles}/>
        <div className={'prompt-screen'}>
          <div
            className={'prompt-screen-inner ' + screenStyles.screen}
            style={styles}
          >
            {this.renderContent()}
          </div>
        </div>
      </WebrcadeContext.Provider>
    );
  }
}

