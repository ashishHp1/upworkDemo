import React from 'react';
import {View, Text} from 'react-native';

import {SearchInput} from '../../components';

import styles from './styles';

const SearchUser = ({navigation}) => {
  const {container} = styles;

  const {navigate} = navigation;

  const _onUserList = userData => {
    navigate('Details', {userData});
  };

  return (
    <View style={container}>
      <SearchInput placeholder="Search User " onUserList={_onUserList} />
    </View>
  );
};

export default SearchUser;
