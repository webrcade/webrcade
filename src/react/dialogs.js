import React from "react";

import {
  loadFeedFromUrl
} from './feeds';

import { iosClose, SettingsEditor, settings } from "@webrcade/app-common";

import AddFeedScreen from './screens/addfeed';
import AlertScreen from './screens/alert'
import SearchScreen from './screens/search';
import YesNoScreen from './screens/yesno';
import ReleaseNotesScreen from './screens/releasenotes'

import {
  Resources,
  LOG,
  TEXT_IDS,
} from '@webrcade/app-common'

export default function Dialogs(props) {
  const { webrcade } = props;
  const { ctx, ScreenEnum } = webrcade;

  const renderSettingsEditor = () => {
    return (
      <SettingsEditor
        ctx={ctx}
        onClose={() => iosClose(() => ctx.showSettingsEditor(false))}
      />
    );
  }

  const renderAddFeed = () => {
    return (
      <AddFeedScreen
        onAdd={(screen, url) => {
          if (url.length !== 0) {
            screen.close();
            if (!webrcade.state.feeds.getFeedForUrl(url)) {
              webrcade.setState({
                mode: ScreenEnum.LOADING,
                loadingStatus: Resources.getText(TEXT_IDS.LOADING_FEED),
              }, () => {
                loadFeedFromUrl(url)
                  .then(([feed, feedJson]) => {
                    // Loading the feed will add it as well.
                    // So, nothing to do here...
                  })
                  .catch(e => LOG.error(e));
              });
            }
          }
        }}
        closeCallback={() => iosClose(() => ctx.showAddFeedScreen(false))}
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
        closeCallback={() => iosClose(() => ctx.showYesNoScreen(false))}
      />
    );
  }

  const renderAlert = () => {
    const props = ctx.getAlertScreenProps();
    return (
      <AlertScreen
        disableAnimation={props.disableAnimation}
        message={props.message}
        onOk={props.onOk}
        showButton={props.showButton}
        closeCallback={() => iosClose(() => ctx.showAlertScreen(false))}
      />
    );
  }

  const renderReleaseNotesScreen = () => {
    return (
      <ReleaseNotesScreen
        onClose={(dontshow) => {
          if (dontshow) {
            settings.setHideVersionInfo();
            settings.save();
          }
          iosClose(() => ctx.showReleaseNotes(false));
        }}
      />
    )
  }

  const renderSearch = () => {
    const props = ctx.getSearchScreenProps();
    return (
      <SearchScreen
        closeCallback={() => iosClose(() => ctx.showSearchScreen(false))}
        initialValue={props.initialValue}
        getCount={props.getCount}
        onSearch={props.onSearch}
        onApply={props.onApply}
        onClear={props.onClear}
      />
    );
  }

  return (
    <>
      {ctx.isAlertScreenOpen() ? renderAlert() : null}
      {ctx.isYesNoScreenOpen() ? renderYesNo() : null}
      {ctx.isAddFeedScreenOpen() ? renderAddFeed() : null}
      {ctx.isSettingsEditorOpen() ? renderSettingsEditor() : null}
      {ctx.isReleaseNotesOpen() ? renderReleaseNotesScreen() : null}
      {ctx.isSearchScreenOpen() ? renderSearch() : null}
    </>
  );
}
