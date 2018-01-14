import React, { Component } from 'react';
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import PayPalButton from './PayPalButton';

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      userListActive: false,
      user: 'guest'
    }
  }

  openUserList() {
    this.setState({userListActive: true});
  }

  closeUserList() {
    this.setState({userListActive: false});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Text style={{fontSize: 20, paddingTop: 5}}>
            {
              this.state.user === 'guest' ?
              'Not currently logged in. '
              : 'Logged in as ' + database[this.state.user].name + '. '
            }
          </Text>
          <View style={{alignSelf: 'center'}}>
            <Button
              onPress={() => this.openUserList()}
              title={this.state.user === 'guest' ? 'Log In' : 'Switch User'}
            />
          </View>
        </View>
        <Modal
          visible={this.state.userListActive}
          animationType={'slide'}
          onRequestClose={() => this.closeUserList()}
        >
          <View style={styles.modal}>
            <FlatList
              data={Object.keys(database)}
              renderItem={({item}) => (
                <TouchableHighlight
                  underlayColor='white'
                  onPress={() => {
                    this.setState({user: item});
                    this.closeUserList();
                  }}
                >
                  <Text style={styles.listElement}>{database[item].name}</Text>
                </TouchableHighlight>
              )}
              keyExtractor={(item) => item}
            />
            {this.state.user !== 'guest' &&
              <Button
                onPress={() => {
                  this.setState({user: 'guest'});
                  this.closeUserList();
                }}
                title='Log out'
              />
            }
          </View>
        </Modal>
        {this.state.user !== 'guest' &&
          <View>
            <Text style={{fontSize: 50}}>
              Shopping{'\n'}
              and{'\n'}
              things{'\n\n'}
            </Text>
            <Text style={{fontSize: 20}}>
              Wow, you found some nice stuff! Let's buy it.{'\n\n'}
            </Text>
            <View style={styles.button}>
              <PayPalButton
                user={database[this.state.user].token}
                cart={database[this.state.user].cart}
              />
            </View>
          </View>
        }
      </View>
    );
  }
};

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

const database = {
  user1: {
    name: 'Kenneth',
    cart: cart1,
    token: '0A041B9462CAA4A31BAC3567E0B6E6FD9100787DB2AB433D96F6D178CABFCE90'
  },
  user2: {
    name: 'Mitsuha',
    cart: cart2,
    token: '6025D18FE48ABD45168528F18A82E265DD98D421A7084AA09F61B341703901A3'
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  modal: {
    flex: 1,
    padding: 25
  },
  listElement: {
    fontSize: 18,
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  button: {
    alignItems: 'center'
  }
});
