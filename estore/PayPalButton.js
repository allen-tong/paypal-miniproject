import React, { Component } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

export default class PayPalButton extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      activeAddress: '',
      activeCard: '',
      backupCard: '',
      addresses: [],
      cards: [],
      total: 0.0,
      payViewActive: false,
      addressListActive: false
    };
  }

  getInfo() {
    fetch('http://10.0.2.2:3000/pay')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          name: responseJson.name,
          activeAddress: responseJson.addresses[0],
          activeCard: responseJson.cards[0],
          backupCard: responseJson.cards[1],
          addresses: responseJson.addresses,
          cards: responseJson.cards,
          total: responseJson.total
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  openPayView(responseJson) {
    this.getInfo();
    this.setState({payViewActive: true});
  }

  closePayView() {
    this.setState({payViewActive: false});
  }

  openAddressList() {
    this.getInfo();
    this.setState({addressListActive: true});
  }

  closeAddressList() {
    this.setState({addressListActive: false});
  }

  _onPress() {
    Alert.alert('Pressed!');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.openPayView()}
          title='Pay with PayPal'
        />
        <Modal
          visible={this.state.payViewActive}
          animationType={'slide'}
          onRequestClose={() => this.closePayView()}
        >
          <View style={styles.modal}>
            <TouchableHighlight
              underlayColor='white'
              onPress={() => this.openAddressList()}
            >
              <Text>
                {
                  'Ship to\n' +
                  this.state.name + '\n' +
                  this.state.activeAddress
                }
              </Text>
            </TouchableHighlight>
            <Modal
              visible={this.state.addressListActive}
              animationType={'slide'}
              onRequestClose={() => this.closePayView()}
            >
              <FlatList
                data={this.state.addresses}
                renderItem={({item}) => (
                  <TouchableHighlight
                    underlayColor='white'
                    onPress={() => {
                      this.setState({activeAddress: item});
                      this.closeAddressList();
                    }}
                  >
                    <Text>{item}</Text>
                  </TouchableHighlight>
                )}
                keyExtractor={(item) => item.toString()}
              />
            </Modal>
            <TouchableHighlight
              underlayColor='white'
              onPress={this._onPress}
            >
              <Text>
                {
                  'Pay with\n' +
                  this.state.activeCard + '\n' +
                  this.state.backupCard + ' (backup)'
                }
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='white'
              onPress={this._onPress}
            >
              <Text>
                {
                  'Total ' + '$' + this.state.total
                }
              </Text>
            </TouchableHighlight>
            <Text>
              {
                'View PayPal Policies and your payment method rights.\n'
              }
            </Text>
            <Button
              onPress={() => {
                this.closePayView();
                Alert.alert('Thank you for shopping with us!');
              }}
              title='Pay Now'
            />
            <Text>
              If money is added to your PayPal balance before this transaction
              completes, the additional balance may be used to complete your
              payment. Learn More.
            </Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    padding: 30
  }
});
