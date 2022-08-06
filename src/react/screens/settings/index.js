import React from "react";
import { Component } from "react";

import {
  dropbox,
  settings,
  showMessage,
  CloudWhiteImage,
  EditorScreen,
  FieldsTab,
  FieldRow,
  FieldLabel,
  FieldControl,
  ImageButton,
  LinkBlackImage,
  LinkWhiteImage,
  LinkOffBlackImage,
  LinkOffWhiteImage,
  Resources,
  Switch,
  TelevisionWhiteImage,
  TuneWhiteImage,
  WebrcadeContext,
  TEXT_IDS
} from '@webrcade/app-common'

export class SettingsEditor extends Component {
  constructor() {
    super();
    const values = {
      expApps: settings.isExpAppsEnabled(),
      vsync: settings.isVsyncEnabled(),
      bilinear: settings.isBilinearFilterEnabled(),
      cloudStorage: settings.isCloudStorageEnabled(),
      dbLinked: settings.getDbToken() !== null
    };
    this.state = {
      tabIndex: null,
      focusGridComps: null,
      values: values,
      originalValues: { ...values }
    };
  }

  componentDidMount() {
  }

  render() {
    const { ctx, onClose } = this.props;
    const { originalValues, tabIndex, values, focusGridComps } = this.state;

    const setFocusGridComps = (comps) => {
      this.setState({ focusGridComps: comps });
    }

    const setValues = (values) => {
      this.setState({ values: values });
    }

    return (
      <EditorScreen
        hidden={ctx.isAlertScreenOpen()}
        showCancel={true}
        onOk={() => {
          settings.setExpAppsEnabled(values.expApps);
          settings.setVsyncEnabled(values.vsync);
          settings.setBilinearFilterEnabled(values.bilinear);
          settings.setCloudStorageEnabled(values.cloudStorage);
          if (originalValues.expApps !== values.expApps) {
            ctx.showAlertScreen(true,
              Resources.getText(TEXT_IDS.RELOAD_EXP_APPS),
              () => {
                settings.save().finally(() => {
                  window.location.reload();
                });
              }, true, true);
          } else {
            settings.save().finally(() => {
              onClose();
            });
          }
        }}
        onClose={onClose}
        focusGridComps={focusGridComps}
        onTabChange={(oldTab, newTab) => this.setState({ tabIndex: newTab })}
        tabs={[{
          image: TelevisionWhiteImage,
          label: Resources.getText(TEXT_IDS.DISPLAY_SETTINGS),
          content: (
            <DisplaySettingsTab
              isActive={tabIndex === 0}
              setFocusGridComps={setFocusGridComps}
              values={values}
              setValues={setValues}
            />
          )
        }, {
          image: CloudWhiteImage,
          label: Resources.getText(TEXT_IDS.CLOUD_STORAGE),
          content: (
            <CloudStorageTab
              isActive={tabIndex === 1}
              setFocusGridComps={setFocusGridComps}
              values={values}
              setValues={setValues}
            />
          )
        }, {
          image: TuneWhiteImage,
          label: Resources.getText(TEXT_IDS.ADVANCED_SETTINGS),
          content: (
            <AdvancedSettingsTab
              isActive={tabIndex === 2}
              setFocusGridComps={setFocusGridComps}
              values={values}
              setValues={setValues}
            />
          )
        }]}
      />
    );
  }
}
SettingsEditor.contextType = WebrcadeContext;

class AdvancedSettingsTab extends FieldsTab {
  constructor() {
    super();
    this.showExperimentalAppsRef = React.createRef();
    this.gridComps = [
      [this.showExperimentalAppsRef]
    ]
  }

  componentDidUpdate(prevProps, prevState) {
    const { gridComps } = this;
    const { setFocusGridComps } = this.props;
    const { isActive } = this.props;

    if (isActive && (isActive !== prevProps.isActive)) {
      setFocusGridComps(gridComps);
    }
  }

  render() {
    const { showExperimentalAppsRef } = this;
    const { focusGrid } = this.context;
    const { setValues, values } = this.props;

    return (
      <>
        <FieldRow>
          <FieldLabel>
            {Resources.getText(TEXT_IDS.EXPERIMENTAL_APPS)}
          </FieldLabel>
          <FieldControl>
            <Switch
              ref={showExperimentalAppsRef}
              onPad={e => focusGrid.moveFocus(e.type, showExperimentalAppsRef)}
              onChange={e => {
                setValues({ ...values, ...{ expApps: e.target.checked } });
              }}
              checked={values.expApps}
            />
          </FieldControl>
        </FieldRow>
      </>
    );
  }
}
AdvancedSettingsTab.contextType = WebrcadeContext;

class DisplaySettingsTab extends FieldsTab {
  constructor() {
    super();
    this.verticalSyncRef = React.createRef();
    this.bilinearFilterRef = React.createRef();
    this.gridComps = [
      [this.verticalSyncRef],
      [this.bilinearFilterRef]
    ]
  }

  componentDidUpdate(prevProps, prevState) {
    const { gridComps } = this;
    const { setFocusGridComps } = this.props;
    const { isActive } = this.props;

    if (isActive && (isActive !== prevProps.isActive)) {
      setFocusGridComps(gridComps);
    }
  }

  render() {
    const { bilinearFilterRef, verticalSyncRef } = this;
    const { focusGrid } = this.context;
    const { setValues, values } = this.props;

    return (
      <>
        <FieldRow>
          <FieldLabel>
            {Resources.getText(TEXT_IDS.VERTICAL_SYNC)}
          </FieldLabel>
          <FieldControl>
            <Switch
              ref={verticalSyncRef}
              onPad={e => focusGrid.moveFocus(e.type, verticalSyncRef)}
              onChange={e => {
                setValues({ ...values, ...{ vsync: e.target.checked } });
              }}
              checked={values.vsync}
            />
          </FieldControl>
        </FieldRow>
        <FieldRow>
          <FieldLabel>
            {Resources.getText(TEXT_IDS.BILINEAR_FILTER)}
          </FieldLabel>
          <FieldControl>
            <Switch
              ref={bilinearFilterRef}
              onPad={e => focusGrid.moveFocus(e.type, bilinearFilterRef)}
              onChange={e => {
                setValues({ ...values, ...{ bilinear: e.target.checked } });
              }}
              checked={values.bilinear}
            />
          </FieldControl>
        </FieldRow>
      </>
    );
  }
}
DisplaySettingsTab.contextType = WebrcadeContext;

class CloudStorageTab extends FieldsTab {
  constructor() {
    super();
    this.cloudStorageRef = React.createRef();
    this.dropboxRef = React.createRef();
    this.gridComps = [
      [this.cloudStorageRef],
      [this.dropboxRef],
    ]
  }

  componentDidUpdate(prevProps, prevState) {
    const { gridComps } = this;
    const { setFocusGridComps } = this.props;
    const { isActive } = this.props;

    if (isActive && (isActive !== prevProps.isActive)) {
      setFocusGridComps(gridComps);
    }
  }

  render() {
    const { cloudStorageRef, dropboxRef } = this;
    const { focusGrid } = this.context;
    const { setValues, values } = this.props;

    return (
      <>
        <FieldRow>
          <FieldLabel>
            {Resources.getText(TEXT_IDS.ENABLED)}
          </FieldLabel>
          <FieldControl>
            <Switch
              ref={cloudStorageRef}
              onPad={e => focusGrid.moveFocus(e.type, cloudStorageRef)}
              onChange={e => {
                setValues({ ...values, ...{ cloudStorage: e.target.checked } });
              }}
              checked={values.cloudStorage}
            />
          </FieldControl>
        </FieldRow>
        {values.cloudStorage &&
          <>
            <FieldRow>
              <FieldLabel>
                {Resources.getText(TEXT_IDS.DROPBOX)}
              </FieldLabel>
              <FieldControl>
                <div>
                  <ImageButton
                    ref={dropboxRef}
                    imgSrc={values.dbLinked ? LinkOffBlackImage : LinkBlackImage}
                    hoverImgSrc={values.dbLinked ? LinkOffWhiteImage : LinkWhiteImage}
                    label={Resources.getText(values.dbLinked ? TEXT_IDS.UNLINK : TEXT_IDS.LINK)}
                    onPad={e => focusGrid.moveFocus(e.type, dropboxRef)}
                    onClick={() => {
                      if (!values.dbLinked) {
                        // Force cloud storage to be enabled
                        settings.setCloudStorageEnabled(true);
                        settings.save().finally(() => {
                          dropbox.link()
                            .catch((e) => showMessage(e));
                        });
                      } else {
                        settings.setDbToken(null);
                        settings.save().finally(() => {
                          setValues({ ...values, ...{ dbLinked: false } });
                        });
                      }
                    }}
                  />
                </div>
              </FieldControl>
            </FieldRow>
            <FieldRow>
              <FieldLabel>
                {Resources.getText(TEXT_IDS.STATUS)}
              </FieldLabel>
              <FieldControl>
                <div>{Resources.getText(values.dbLinked ? TEXT_IDS.LINKED : TEXT_IDS.UNLINKED)}</div>
              </FieldControl>
            </FieldRow>
          </>
        }
      </>
    );
  }
}
CloudStorageTab.contextType = WebrcadeContext;