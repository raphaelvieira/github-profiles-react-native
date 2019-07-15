import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  DetailButton,
} from './styles';

export default class User extends Component {
  /** used as function for handle with params, because static methos can't access variable 'this' */
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  // propTypes validation
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    refreshing: false,
    page: 1,
  };

  async componentDidMount() {
    this.loadStarred();
  }

  loadStarred = async () => {
    const { navigation } = this.props;
    const { page } = this.state;
    const user = navigation.getParam('user');
    this.setState({ loading: true });
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    this.setState({
      stars: response.data,
      loading: false,
      page: Number(page) + 1,
      refreshing: false,
    });
  };

  refreshList = async () => {
    await this.setState({ refreshing: true, page: 1 });
    this.loadStarred();
  };

  loadMore = () => {
    this.loadStarred();
  };

  handleNavigate = repository => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator color="#7159c1" />
        ) : (
          <Stars
            onRefresh={this.refreshList} // function triggered when user slide the list down
            refreshing={refreshing} // variable state true/false for check if list is updating
            onEndReachedThreshold={0.2} // function to load when reach 20% of items limit
            onEndReached={this.loadMore} // function to load more items
            loading={loading}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
                <DetailButton onPress={() => this.handleNavigate(item)}>
                  <Icon name="arrow-forward" size={20} />
                </DetailButton>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
