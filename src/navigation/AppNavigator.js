import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SearchUser from '../screens/searchUser';
import UserDetails from '../screens/userDetails';

import {Colors} from '../theme/color';

const Stack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={'Search'} component={SearchUser} />
        <Stack.Screen name={'Details'} component={UserDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStackScreen;
