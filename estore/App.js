import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import PayPalButton from './PayPalButton';

export default class App extends Component<{}> {
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
          <PayPalButton />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
