import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import PayPalButton from './PayPalButton';

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      cart: {
        items: [
          {id: 1, name: 'Screen protector', quantity: 2, price: 7.98},
          {id: 2, name: 'Phone case', quantity: 1, price: 8.98},
          {id: 3, name: 'Portable charger', quantity: 1, price: 10.98}
        ],
        subtotal: 35.92,
        tax: 3.06,
        shipping: 0.00,
        discount: 10.00,
        total: 28.98
      }
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
          <PayPalButton breakdown={true} cart={this.state.cart}/>
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
