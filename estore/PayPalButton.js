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
      addressListActive: false,
      cardListActive: false
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
    this.setState({addressListActive: true});
  }

  closeAddressList() {
    this.setState({addressListActive: false});
  }

  openCardList() {
    this.setState({cardListActive: true});
  }

  closeCardList() {
    this.setState({cardListActive: false});
  }

  _onPress() {
    Alert.alert('Pressed!');
  }

  render() {
    return (
      <View>
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
              <View style={styles.textElement}>
                <Text style={styles.headerText}>Ship to</Text>
                <Text style={styles.mainText}>{this.state.name}</Text>
                <Text>{this.state.activeAddress}</Text>
              </View>
            </TouchableHighlight>
            <Modal
              visible={this.state.addressListActive}
              animationType={'slide'}
              onRequestClose={() => this.closeAddressList()}
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
                    <Text style={[styles.textElement, styles.mainText]}>
                      {item}
                    </Text>
                  </TouchableHighlight>
                )}
                keyExtractor={(item) => item.toString()}
              />
            </Modal>
            <TouchableHighlight
              underlayColor='white'
              onPress={() => this.openCardList()}
            >
              <View style={styles.textElement}>
                <Text style={styles.headerText}>Pay with</Text>
                <Text style={styles.mainText}>{this.state.activeCard}</Text>
                <Text>{this.state.backupCard + ' (backup)'}</Text>
              </View>
            </TouchableHighlight>
            <Modal
              visible={this.state.cardListActive}
              animationType={'slide'}
              onRequestClose={() => this.closeCardList()}
            >
              <FlatList
                data={this.state.cards}
                renderItem={({item}) => (
                  <TouchableHighlight
                    underlayColor='white'
                    onPress={() => {
                      this.setState(
                        item !== this.state.backupCard ?
                          {activeCard: item}
                          : {
                              backupCard: this.state.activeCard,
                              activeCard: item
                            });
                      this.closeCardList();
                    }}
                  >
                    <Text style={[styles.textElement, styles.mainText]}>
                      {item}
                    </Text>
                  </TouchableHighlight>
                )}
                keyExtractor={(item) => item.toString()}
              />
            </Modal>
            <TouchableHighlight
              underlayColor='white'
              onPress={this._onPress}
            >
              <View style={[styles.textElement, {flexDirection: 'row'}]}>
                <Text style={styles.headerText}>Total</Text>
                <Text style={styles.headerText}>{'$' + this.state.total}</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.textElement}>
              <Text>
                View
                <Text style={styles.link}> PayPal Policies </Text>
                and your payment method rights.
              </Text>
            </View>
            <Button
              onPress={() => {
                this.closePayView();
                Alert.alert('Thank you for shopping with us!');
              }}
              title='Pay Now'
            />
            <View style={styles.textElement}>
              <Text>
                If money is added to your PayPal balance before this transaction
                completes, the additional balance may be used to complete your
                payment. <Text style={styles.link}>Learn More.</Text>
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    padding: 20
  },
  textElement: {
    justifyContent: 'space-between',
    padding: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  mainText: {
    fontSize: 18
  },
  link: {
    fontWeight: 'bold',
    color: 'cornflowerblue'
  }
});
