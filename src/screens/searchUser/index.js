import React from 'react';
import {View, Text} from 'react-native';

import {SearchInput} from '../../components';

import styles from './styles';

const SearchUser = () => {
  const {container} = styles;
  return (
    <View style={container}>
      <SearchInput placeholder="Search User " />
    </View>
  );
};

export default SearchUser;
