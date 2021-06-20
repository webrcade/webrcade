import { Screen, WebrcadeContext } from '@webrcade/app-common'

require("./style.scss");

export default class PromptScreen extends Screen {
  renderContent() { 
    return null; 
  }

  render() {    
    const { screenContext, screenStyles } = this;
    const { height } = this.props;

    const styles = {};
    if (height) {
      styles.height = height;
    }

    return (
      <WebrcadeContext.Provider value={screenContext}>
        <div className={screenStyles['screen-transparency']} />
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

