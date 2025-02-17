import React, { Component } from 'react'

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Button,
  AsyncStorage,
  FlatList,
  SectionList,
  Header,
  TouchableHighlight,
} from 'react-native';

import { checkToken, setAccessToken, getAccessToken, setApiInformation, getApiInformation } from './Api';
import OrderListItem from './OrderListItem'
import OrderShow from './OrderShow'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class OrderIndex extends Component {

  constructor(props) {
    super(props);

    this.state = { refresh: false };

  }

  componentWillMount() {
    console.log("Order Index Starting")
    getApiInformation(this._getOrders, this._handleError)
  }

  _getOrders = (apiInfo) => {
    fetch("https://green-delivery.herokuapp.com/api/orders",{
      method: "GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'access-token': apiInfo['accessToken'],
        'token-type': 'Bearer',
        'client': apiInfo['client'],
        'uid': apiInfo['uid'],
        'expiry': apiInfo['expiry']
      },
    })
      .then(response => this._setOrders(response))
      .catch(error => this._handleError(error))
  };

  _handleError = (error) => {
    console.log(error);
  };


  _setOrders = (response) => {
    checkToken(response)
    var orders = JSON.parse(response._bodyText)
    console.log(orders)
    this.setState({orders: orders})
    this.setState({refresh: false})

  };

  _onButtonPress = () => {
    console.log(this.state.orders)
  };

  _refreshPage = () => {
    this.setState({refresh: true})
    getApiInformation(this._getOrders, this._handleError)
  };

  _keyExtractor = (order, index) => index;

  _renderItem = (order) => {
    return(
      <OrderListItem
        order={order.item}
        navigation={this.props.navigation}
      />
    );
  };

  render() {
    var orders = this.state.orders ?
      <SectionList
        // keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        renderSectionHeader={({section}) => <Text style={{fontWeight: "800", fontSize: 26, marginBottom: "2%"}}>{section.title}</Text>}
        sections={[{ data: this.state.orders.orders_in_delivery, title: "Current Order" }, { data: this.state.orders.orders_in_queue, title: "Queued Orders" }]}
        refreshing={this.state.refresh}
        onRefresh={ () => this._refreshPage() }
      /> : <Text>{"Loading"}</Text>
    return (
      <View style={styles.container}>
        <Text style={styles.title}></Text>
        {orders}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
  },

  container: {
    flex: 1
  },
});
