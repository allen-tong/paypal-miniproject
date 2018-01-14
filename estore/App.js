import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import PayPalButton from './PayPalButton';

/* SHA-2 hash "tokens" for users */
const users = {
  user1: '0A041B9462CAA4A31BAC3567E0B6E6FD9100787DB2AB433D96F6D178CABFCE90',
  user2: '6025D18FE48ABD45168528F18A82E265DD98D421A7084AA09F61B341703901A3'
}

const cart1 = {
  items: [
    {id: 1, name: 'Screen protector', quantity: 2, price: 7.98},
    {id: 2, name: 'Phone case', quantity: 1, price: 8.98},
    {id: 3, name: 'Portable charger', quantity: 1, price: 10.98}
  ],
  subtotal: 35.92,
  tax: 3.06,
  shipping: 5.00,
  discount: -15.00,
  total: 28.98
};

const cart2 = {
  items: [
    {id: 4, name: 'Silk thread - Red', quantity: 2, price: 3.95},
    {id: 5, name: 'Sake', quantity: 1, price: 19.89}
  ],
  subtotal: 27.79,
  tax: 2.37,
  shipping: 0.00,
  discount: -10.00,
  total: 20.16
};

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      user: users.user1,
      cart: cart1
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 50}}>
          Shopping{'\n'}
          and{'\n'}
          things{'\n\n'}
        </Text>
        <Text style={{fontSize: 20}}>
          Wow, you found some nice stuff! Let's buy it.{'\n\n'}
        </Text>
        <View style={styles.button}>
          <PayPalButton user={this.state.user} cart={this.state.cart}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
