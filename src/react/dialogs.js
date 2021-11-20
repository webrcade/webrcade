import React from "react";

import {
  loadFeedFromUrl,
} from './feeds';

import AddFeedScreen from './screens/addfeed';
import AlertScreen from './screens/alert'
import YesNoScreen from './screens/yesno';

import {
  storeFeeds,
  Resources,
  LOG,
  TEXT_IDS,
} from '@webrcade/app-common'

export default function Dialogs(props) {
  const { webrcade } = props;
  const { feeds } = webrcade.state;
  const { ctx, ScreenEnum } = webrcade;

  const renderAddFeed = () => {
    return (
      <AddFeedScreen
        onAdd={(screen, url) => {
          if (url.length !== 0) {
            screen.close();
            if (!feeds.getFeedForUrl(url)) {
              webrcade.setState({
                mode: ScreenEnum.LOADING,
                loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
              }, () => {
                loadFeedFromUrl(url)
                  .then(([feed, feedJson]) => {
                    feeds.addFeed({ title: "New Feed", url: url });
                    feeds.updateFeed(url, feedJson);
                    storeFeeds(feeds);
                  })
                  .catch(e => LOG.info(e));
              });
            }
          }
        }}
        closeCallback={() => { ctx.showAddFeedScreen(false) }}
      />
    );
  }

  const renderYesNo = () => {
    const props = ctx.getYesNoScreenProps();
    return (
      <YesNoScreen
        height="10rem"
        message={props.message}
        onYes={props.onYes}
        closeCallback={() => { ctx.showYesNoScreen(false); }}
      />
    );
  }

  const renderAlert = () => {
    const props = ctx.getAlertScreenProps();
    return (
      <AlertScreen
        message={props.message}
        onOk={props.onOk}
        showButton={props.showButton}
        closeCallback={() => { ctx.showAlertScreen(false); }}
      />
    );
  }

  return (
    <>
      {ctx.isAlertScreenOpen() ? renderAlert() : null}
      {ctx.isYesNoScreenOpen() ? renderYesNo() : null}
      {ctx.isAddFeedScreenOpen() ? renderAddFeed() : null}
    </>
  );
}
