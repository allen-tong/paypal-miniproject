import React, { Component } from 'react';
import {
  Alert,
  Animated,
  Button,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import PropTypes from 'prop-types';

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
      total: 0.00,
      payViewActive: false,
      addressListActive: false,
      cardListActive: false,
      cartViewActive: false,
      deviceWidth: Dimensions.get('window').width,
      screenPos: new Animated.Value(0)
    };
  }

  getInfo() {
    fetch('http://10.0.2.2:3000/' + this.props.user, fetchInit)
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

  openPayView() {
    this.getInfo();
    this.setState({payViewActive: true});
  }

  closePayView() {
    this.setState({payViewActive: false});
  }

  slideLeft() {
    Animated.timing(this.state.screenPos, {
      toValue: -this.state.deviceWidth,
      duration: 300,
      useNativeDriver: true
    }).start();
  }

  slideRight() {
    Animated.timing(this.state.screenPos, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }

  onRotate() {
    this.setState({deviceWidth: Dimensions.get('window').width});
    if (this.state.addressListActive
        || this.state.cardListActive
        || this.state.cartViewActive) {
      this.slideLeft();
    } else {
      this.slideRight();
    }
  }

  /* Possible to click fast enough such that opening method is called
     before element is finished closing, so state is set twice */
  openAddressList() {
    this.setState({addressListActive: true});
    this.slideLeft();
    setTimeout(() => {
      this.setState({addressListActive: true});
    }, 300);
  }

  closeAddressList() {
    this.slideRight();
    setTimeout(() => {
      this.setState({addressListActive: false});
    }, 300);
  }

  openCardList() {
    this.setState({cardListActive: true});
    this.slideLeft();
    setTimeout(() => {
      this.setState({cardListActive: true});
    }, 300);
  }

  closeCardList() {
    this.slideRight();
    setTimeout(() => {
      this.setState({cardListActive: false});
    }, 300);
  }

  openCartView() {
    this.setState({cartViewActive: true});
    this.slideLeft();
    setTimeout(() => {
      this.setState({cartViewActive: true});
    }, 300);
  }

  closeCartView() {
    this.slideRight();
    setTimeout(() => {
      this.setState({cartViewActive: false});
    }, 300);
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
          <View
            onLayout={() => {this.onRotate()}}
            style={{
              flex: 1,
              flexDirection: 'row',
              width: 2 * this.state.deviceWidth
            }}
          >

            <Animated.ScrollView
              style={[
                styles.modal,
                {transform: [{translateX: this.state.screenPos}]}
              ]}
            >
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

              <TouchableHighlight
                underlayColor='white'
                onPress={() => this.openCardList()}
              >
                <View style={styles.selectable}>
                  <View style={styles.textElement}>
                    <Text style={styles.headerText}>Pay with</Text>
                    <Text style={styles.mainText}>
                      {this.state.activeCard}
                    </Text>
                    <Text>{
                      this.state.backupCard ?
                        this.state.backupCard + ' (backup)'
                        : ''
                    }</Text>
                  </View>
                  <Text style={styles.rightAngle}>{rightAngle}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor='white'
                onPress={() => {this.openCartView()}}
              >
                <View style={styles.splitRow}>
                  <Text style={styles.headerText}>Total</Text>
                  <Text style={styles.headerText}>
                    {toPrice(this.props.cart.total) + '   '}
                    <Text style={styles.rightAngle}>{rightAngle}</Text>
                  </Text>
                </View>
              </TouchableHighlight>

              {topSubtext}

              <Button
                onPress={() => {
                  this.closePayView();
                  Alert.alert('Thanks for shopping with us!');
                }}
                title='Pay Now'
              />

              {bottomSubtext}
            </Animated.ScrollView>

            {
              this.state.addressListActive ? (
                <Animated.ScrollView
                  style={[
                    styles.modal,
                    {transform: [{translateX: this.state.screenPos}]}
                  ]}
                >
                  <BackButton onPress={() => this.closeAddressList()}/>
                  <SelectList
                    header='Select shipping address'
                    data={this.state.addresses}
                    onSelect={(item) => {
                      this.setState({activeAddress: item});
                      this.closeAddressList();
                    }}
                  />
                </Animated.ScrollView>

              ) : this.state.cardListActive ? (
                <Animated.View
                  style={[
                    styles.modal,
                    {transform: [{translateX: this.state.screenPos}]}
                  ]}
                >
                  <BackButton onPress={() => this.closeCardList()}/>
                  <SelectList
                    style={{flex: 0.5}}
                    header='Select primary card'
                    data={this.state.cards}
                    onSelect={(item) => {
                      this.setState(
                        item !== this.state.backupCard ?
                          {activeCard: item}
                          : {
                              backupCard: this.state.activeCard,
                              activeCard: item
                            });
                      this.closeCardList();
                    }}
                  />

                  {this.state.backupCard &&
                    <SelectList
                      style={{flex: 0.5}}
                      header='Select backup card'
                      data={this.state.cards}
                      onSelect={(item) => {
                        this.setState(
                          item !== this.state.activeCard ?
                            {backupCard: item}
                            : {
                                activeCard: this.state.backupCard,
                                backupCard: item
                              });
                        this.closeCardList();
                      }}
                    />
                  }
                </Animated.View>

              ) : this.state.cartViewActive ? (
                <Animated.ScrollView
                  style={[
                    styles.modal,
                    {transform: [{translateX: this.state.screenPos}]}
                  ]}
                >
                  <Text style={styles.cartHeader}>MY SHOPPING CART</Text>
                  {this.props.cart.items &&
                    <CartBreakdown items={this.props.cart.items} />
                  }

                  {(this.props.cart.subtotal
                    || this.props.cart.subtotal == 0) &&
                    <PriceLabel
                      text='Subtotal'
                      price={this.props.cart.subtotal}
                    />
                  }

                  {(this.props.cart.tax || this.props.cart.tax == 0) &&
                    <PriceLabel text='Tax' price={this.props.cart.tax} />
                  }

                  {(this.props.cart.shipping
                    || this.props.cart.shipping == 0) &&
                    <PriceLabel
                      text='Shipping'
                      price={this.props.cart.shipping}
                    />
                  }

                  {(this.props.cart.discount
                    || this.props.cart.discount == 0) &&
                    <PriceLabel
                      text='Discounts & Special Offers'
                      price={this.props.cart.discount}
                    />
                  }

                  <PriceLabel text='Total' price={this.props.cart.total} />
                  <View style={{height: 100, paddingVertical: 10}}>
                    <Button
                      onPress={() => {this.closeCartView()}}
                      title='Back to checkout'
                    />
                  </View>
                </Animated.ScrollView>

              ) : (
                <Animated.ScrollView
                  style={[
                    styles.modal,
                    {transform: [{translateX: this.state.screenPos}]}
                  ]}
                />
              )
            }

          </View>
        </Modal>

      </View>
    );
  }
};

PayPalButton.propTypes = {
  user: PropTypes.string.isRequired,
  cart: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      quantity: PropTypes.number,
      price: PropTypes.number
    })),
    subtotal: PropTypes.number,
    tax: PropTypes.number,
    shipping: PropTypes.number,
    discount: PropTypes.number,
    total: PropTypes.number.isRequired
  })
};

class BackButton extends Component {
  render() {
    return (
      <TouchableHighlight
        underlayColor='white'
        onPress={() => {this.props.onPress()}}
      >
        <Text style={styles.backButton}>{leftAngle + '  Back'}</Text>
      </TouchableHighlight>
    );
  }
}

class SelectList extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Text style={[styles.textElement, styles.headerText]}>
          {this.props.header}
        </Text>
        <FlatList
          data={this.props.data}
          renderItem={({item}) => (
            <TouchableHighlight
              underlayColor='white'
              onPress={() => {this.props.onSelect(item)}}
            >
              <Text style={[styles.textElement, styles.mainText]}>
                {item}
              </Text>
            </TouchableHighlight>
          )}
          keyExtractor={(item) => item.toString()}
        />
      </View>
    )
  }
}

class CartBreakdown extends Component {
  render() {
    return (
      <View>
        <Text style={styles.headerText}>Items</Text>
        <View style={styles.splitRow}>
          <FlatList
            data={cartItems.concat(this.props.items)}
            renderItem={({item}) => (
              <Text style={styles.cartItem}>{item.name}</Text>
            )}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            data={cartItems.concat(this.props.items)}
            renderItem={({item}) => (
              <Text style={styles.cartQuantity}>
                {item.quantity}
              </Text>
            )}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            data={cartItems.concat(this.props.items)}
            renderItem={({item}) => (
              <Text style={styles.cartPrice}>
                {item.id === -1 ?
                  item.price
                  : toPrice(item.price)}
              </Text>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    );
  }
}

class PriceLabel extends Component {
  render() {
    return (
      <View style={styles.splitRow}>
        <Text style={styles.headerText}>{this.props.text}</Text>
        <Text style={styles.headerText}>{toPrice(this.props.price)}</Text>
      </View>
    );
  }
}

function toPrice(price) {
  return (
    (price >= 0) ?
      '$' + price.toFixed(2)
      : '-$' + (-price).toFixed(2)
  );
}

const fetchInit = {
  method: 'GET',
  headers: {
    'content-type': 'application/json'
  },
  mode: 'cors',
  credentials: 'include'
};

const leftAngle = String.fromCharCode(10216);
const rightAngle = String.fromCharCode(10217);

const cartItems = [
  {id: -1, name: 'Name', quantity: 'Quantity', price: 'Price'}
];

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  selectable: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  backButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'cornflowerblue',
    paddingVertical: 10
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

const topSubtext = (
  <View style={styles.textElement}>
    <Text>
      View
      <Text style={styles.link}> PayPal Policies </Text>
      and your payment method rights.
    </Text>
  </View>
);

const bottomSubtext = (
  <View style={styles.textElement}>
    <Text style={{fontSize: 12}}>
      If money is added to your PayPal balance before this transaction
      completes, the additional balance may be used to complete your
      payment. <Text style={styles.link}>Learn More.</Text>
    </Text>
  </View>
);
