import React, { Component } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

export default class PayPalButton extends Component<{}> {
  constructor(props) {
    super(props);
    if (this.props.cart.items) {
      const cartItems = [
        {id: -1, name: 'Name', quantity: 'Quantity', price: 'Price'}
      ];
      this.props.cart.items = cartItems.concat(this.props.cart.items);
    }
    this.state = {
      name: '',
      activeAddress: '',
      activeCard: '',
      backupCard: '',
      addresses: [],
      cards: [],
      total: 0.00,
      payViewActive: false,
      addressListActive: false,
      cardListActive: false,
      cartViewActive: false
    };
  }

  getInfo() {
    fetch('http://10.0.2.2:3000/' + this.props.user)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          name: responseJson.name,
          activeAddress: responseJson.addresses[0],
          activeCard: responseJson.cards[0],
          backupCard: responseJson.cards[1] ? responseJson.cards[1] : null,
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

  openCartView() {
    this.setState({cartViewActive: true});
  }

  closeCartView() {
    this.setState({cartViewActive: false});
  }

  toPrice(price) {
    return (
      (price >= 0) ?
        '$' + price.toFixed(2)
        : '-$' + (-price).toFixed(2)
    );
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
          <ScrollView style={styles.modal}>
            <TouchableHighlight
              underlayColor='white'
              onPress={() => this.openAddressList()}
            >
              <View style={styles.selectable}>
                <View style={styles.textElement}>
                  <Text style={styles.headerText}>Ship to</Text>
                  <Text style={styles.mainText}>{this.state.name}</Text>
                  <Text>{this.state.activeAddress}</Text>
                </View>
                <Text style={styles.rightAngle}>{rightAngle}</Text>
              </View>
            </TouchableHighlight>
            <Modal
              visible={this.state.addressListActive}
              animationType={'slide'}
              onRequestClose={() => this.closeAddressList()}
            >
              <View style={styles.modal}>
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
              </View>
            </Modal>
            <TouchableHighlight
              underlayColor='white'
              onPress={() => this.openCardList()}
            >
              <View style={styles.selectable}>
                <View style={styles.textElement}>
                  <Text style={styles.headerText}>Pay with</Text>
                  <Text style={styles.mainText}>{this.state.activeCard}</Text>
                  <Text>{
                    this.state.backupCard ?
                      this.state.backupCard + ' (backup)'
                      : ''
                  }</Text>
                </View>
                <Text style={styles.rightAngle}>{rightAngle}</Text>
              </View>
            </TouchableHighlight>
            <Modal
              visible={this.state.cardListActive}
              animationType={'slide'}
              onRequestClose={() => this.closeCardList()}
            >
              <View style={styles.modal}>
                <View style={{flex: 0.5}}>
                  <Text style={[styles.textElement, styles.headerText]}>
                    Select primary card
                  </Text>
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
                </View>
                {this.state.backupCard &&
                  <View style={{flex: 0.5}}>
                    <Text style={[styles.textElement, styles.headerText]}>
                      Select backup card
                    </Text>
                    <FlatList
                      data={this.state.cards}
                      renderItem={({item}) => (
                        <TouchableHighlight
                          underlayColor='white'
                          onPress={() => {
                            this.setState(
                              item !== this.state.activeCard ?
                                {backupCard: item}
                                : {
                                    activeCard: this.state.backupCard,
                                    backupCard: item
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
                  </View>
                }
              </View>
            </Modal>
            <TouchableHighlight
              underlayColor='white'
              onPress={() => {this.openCartView()}}
            >
              <View style={styles.splitRow}>
                <Text style={styles.headerText}>Total</Text>
                <Text style={styles.headerText}>
                  {this.toPrice(this.props.cart.total) + '   '}
                  <Text style={styles.rightAngle}>{rightAngle}</Text>
                </Text>
              </View>
            </TouchableHighlight>
            <Modal
              visible={this.state.cartViewActive}
              animationType={'slide'}
              onRequestClose={() => this.closeCartView()}
            >
              <ScrollView style={styles.modal}>
                <Text style={styles.cartHeader}>MY SHOPPING CART</Text>
                {this.props.cart.items &&
                  <View>
                    <Text style={styles.headerText}>Items</Text>
                    <View style={styles.splitRow}>
                      <FlatList
                        data={this.props.cart.items}
                        renderItem={({item}) => (
                          <Text style={styles.cartItem}>{item.name}</Text>
                        )}
                        keyExtractor={(item) => item.id}
                      />
                      <FlatList
                        data={this.props.cart.items}
                        renderItem={({item}) => (
                          <Text style={styles.cartQuantity}>
                            {item.quantity}
                          </Text>
                        )}
                        keyExtractor={(item) => item.id}
                      />
                      <FlatList
                        data={this.props.cart.items}
                        renderItem={({item}) => (
                          <Text style={styles.cartPrice}>
                            {item.id === -1 ?
                              item.price
                              : this.toPrice(item.price)}
                          </Text>
                        )}
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                  </View>
                }
                {(this.props.cart.subtotal || this.props.cart.subtotal == 0) &&
                  <View style={styles.splitRow}>
                    <Text style={styles.headerText}>Subtotal</Text>
                    <Text style={styles.headerText}>
                      {this.toPrice(this.props.cart.subtotal)}
                    </Text>
                  </View>
                }
                {(this.props.cart.tax || this.props.cart.tax == 0) &&
                  <View style={styles.splitRow}>
                    <Text style={styles.headerText}>Tax</Text>
                    <Text style={styles.headerText}>
                      {this.toPrice(this.props.cart.tax)}
                    </Text>
                  </View>
                }
                {(this.props.cart.shipping || this.props.cart.shipping == 0) &&
                  <View style={styles.splitRow}>
                    <Text style={styles.headerText}>Shipping</Text>
                    <Text style={styles.headerText}>
                      {this.toPrice(0)}
                    </Text>
                  </View>
                }
                {(this.props.cart.discount || this.props.cart.discount == 0) &&
                  <View style={styles.splitRow}>
                    <Text style={styles.headerText}>
                      Discounts & Special Offers
                    </Text>
                    <Text style={styles.headerText}>
                      {this.toPrice(this.props.cart.discount)}
                    </Text>
                  </View>
                }
                <View style={styles.splitRow}>
                  <Text style={styles.headerText}>Total</Text>
                  <Text style={styles.headerText}>
                    {this.toPrice(this.props.cart.total)}
                  </Text>
                </View>
                <View style={{height: 100, paddingVertical: 10}}>
                  <Button
                    onPress={() => {this.closeCartView()}}
                    title='Back to checkout'
                  />
                </View>
              </ScrollView>
            </Modal>
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
              <Text style={{fontSize: 12}}>
                If money is added to your PayPal balance before this transaction
                completes, the additional balance may be used to complete your
                payment. <Text style={styles.link}>Learn More.</Text>
              </Text>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const rightAngle = String.fromCharCode(10217);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  selectable: {
    flexDirection: 'row', justifyContent: 'space-between'
  },
  textElement: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  mainText: {
    fontSize: 18
  },
  rightAngle: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'cornflowerblue'
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  cartHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: 10
  },
  cartItem: {
    fontSize: 18,
    paddingLeft: 10
  },
  cartQuantity: {
    fontSize: 18,
    alignSelf: 'center'
  },
  cartPrice: {
    fontSize: 18,
    alignSelf: 'flex-end'
  },
  link: {
    fontWeight: 'bold',
    color: 'cornflowerblue'
  }
});
