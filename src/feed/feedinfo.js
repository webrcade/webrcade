class FeedInfo {
  constructor(props) {
    this.props = props;

    if (props === undefined) {
      throw new Error("Feed properties were not specified.");
    }
    if (props.name === undefined) {
      throw new Error("A feed name was not specified.");
    }
    if (props.url === undefined) {
      throw new Error("A feed url was not specified");
    }
  }

  getName() {
    return this.props.name;
  }

  getDescription() {
    return this.props.description;
  }

  getUrl() {
    return this.props.url;
  }

  getThumbnail() {
    return this.props.thumbnail;
  }

  getProps() {
    return this.props;
  }
}

export { FeedInfo }

