import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default class Repository extends Component {
  /** used as function for handle with params, because static methos can't access variable 'this' */
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  // propTypes validation
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const repository = navigation.getParam('repository');

    return (
      <WebView source={{ uri: repository.html_url }} style={{ flex: 1 }} />
    );
  }
}
