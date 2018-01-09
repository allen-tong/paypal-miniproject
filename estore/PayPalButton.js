import React, { Component } from 'react';
import {
  Alert,
  Button,
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
      addresses: [],
      cards: [],
      total: 0.0,
      modalVisible: false,
    };
  }

  openModal(responseJson) {
    this.setState({
      name: responseJson.name,
      addresses: responseJson.addresses,
      cards: responseJson.cards,
      total: responseJson.total,
      modalVisible:true
    });
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  pay() {
    fetch('http://10.0.2.2:3000/pay')
      .then((response) => response.json())
      .then((responseJson) => this.openModal(responseJson))
      .catch((error) => {
        console.error(error);
      });
  }

  _onPress() {
    Alert.alert('Pressed!');
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.pay()}
          title='Pay with PayPal'
        />
        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => {
            this.closeModal();
          }}
        >
          <View style={styles.modal}>
            <TouchableHighlight
              underlayColor='white'
              onPress={this._onPress}
            >
              <Text>
                {
                  'Ship to\n' +
                  this.state.name + '\n' +
                  this.state.addresses[0]
                }
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor='white'
              onPress={this._onPress}
            >
              <Text>
                {
                  'Pay with\n' +
                  this.state.cards[0] + '\n' +
                  this.state.cards[1] + ' (backup)'
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
                this.closeModal();
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
