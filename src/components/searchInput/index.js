import React, {useState, useMemo, useEffect} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} from 'react-native';

import debounce from 'lodash.debounce';

import {DeviceHeight, DeviceWidth} from '../../utils';
import {Colors} from '../../theme/color';
import {icons} from '../../images/index';
import {CONFIG} from '../../../config';

const SearchInput = ({inputStyle, placeholder}) => {
  let _requests = [];
  let _results = [];

  const [showList, setShowList] = useState(false);
  const [userData, setUserData] = useState([]);
  const [stateText, setStateText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // This will load the default value's search results after the view has
    // been rendered
    _handleChangeText(stateText);
    return () => {
      _abortRequests();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _abortRequests = () => {
    _requests.map(i => i.abort());
    _requests = [];
  };

  const _request = text => {
    _abortRequests();
    if (text) {
      const request = new XMLHttpRequest();
      _requests.push(request);
      request.timeout = 20000;
      request.ontimeout = () => {
        console.warn('Time out');
      };
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status === 200) {
          const responseJSON = JSON.parse(request.responseText);
          setIsLoading(false);
          if (responseJSON && responseJSON.items) {
            const results = responseJSON.items;
            _results = results;
            setUserData(results);
          }
        } else {
          console.warn(
            'github user api: request could not be completed or has been aborted',
          );
        }
      };
      request.open(
        'GET',
        `${CONFIG.API_URL}${text}&access_token=${CONFIG.Github_token}&per_page=5`,
      );

      request.send();
      return;
    }
  };

  const debounceData = useMemo(() => debounce(_request, 0));

  const _onChangeText = text => {
    setIsLoading(true);
    setStateText(text);
    debounceData(text);
  };

  const _handleChangeText = text => {
    if (text !== ' ' && stateText.length >= 0) {
      _onChangeText(text);
    }
  };

  const _onFocus = () => {
    setShowList(true);
  };

  const _onBlur = e => {
    setShowList(false);
  };

  const _onPress = () => {};

  const _getRowLoader = () => {
    return <ActivityIndicator animating={true} size="small" />;
  };

  const _renderRowData = (rowData, index) => {
    const {login, avatar_url} = rowData;
    return (
      <View style={styles.userRow}>
        <Image style={styles.image} source={{uri: avatar_url}} />
        <Text style={styles.loginText}>{login}</Text>
      </View>
    );
  };

  const _renderLoader = rowData => {
    if (rowData.isLoading === true) {
      return <View style={[styles.loader]}>{_getRowLoader()}</View>;
    }

    return null;
  };

  const _renderSeparator = (sectionID, rowID) => {
    return <View style={[styles.separator]} />;
  };

  const _renderListEmptyComponent = () => {
    return <></>;
  };

  const _renderLeftIcon = () => {
    return <Image style={styles.leftIcon} source={icons.user_pic} />;
  };

  const _renderRightIcon = () => {
    return (
      <ActivityIndicator
        style={styles.loader}
        animating={true}
        size="small"
        color="#2980b9"
      />
    );
  };

  const _renderRow = (rowData = {}, index) => {
    return (
      <ScrollView
        contentContainerStyle={{width: '100%', height: '40%', borderRadius: 10}}
        scrollEnabled
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <TouchableHighlight
          style={{width: '100%'}}
          onPress={() => _onPress(rowData)}>
          <View style={[styles.row]}>
            {_renderLoader(rowData)}
            {_renderRowData(rowData, index)}
          </View>
        </TouchableHighlight>
      </ScrollView>
    );
  };

  const _getFlatList = () => {
    const keyGenerator = () => Math.random().toString(36).substr(2, 10);

    if (showList && userData.length > 0 && stateText.length > 0) {
      return (
        <FlatList
          nativeID="result-list-id"
          style={styles.flatList}
          data={userData}
          keyExtractor={keyGenerator}
          extraData={[userData, showList]}
          ItemSeparatorComponent={_renderSeparator}
          renderItem={({item, index}) => _renderRow(item, index)}
          ListEmptyComponent={_renderListEmptyComponent}
        />
      );
    }
    return <></>;
  };

  return (
    <View>
      <View style={styles.inputWrapper}>
        {_renderLeftIcon()}
        <TextInput
          style={[styles.input, inputStyle]}
          value={stateText}
          placeholder={placeholder}
          placeholderTextColor={Colors.border}
          onChangeText={_handleChangeText}
          onFocus={e => {
            _onFocus();
          }}
          onBlur={e => {
            _onBlur(e);
          }}
        />
        {isLoading && stateText.length > 0 ? _renderRightIcon() : null}
      </View>
      {_getFlatList()}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: DeviceHeight * 0.055,
    width: DeviceWidth * 0.8,
    color: Colors.white,
    padding: 10,
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  row: {
    backgroundColor: Colors.white,
    padding: 13,
    minHeight: 44,
    flexDirection: 'row',
  },
  description: {},
  flatList: {
    // height: DeviceHeight * 0.35,
    borderRadius: 10,
    marginTop: 1,
  },
  inputWrapper: {
    width: DeviceWidth * 0.92,
    flexDirection: 'row',
    height: DeviceHeight * 0.053,
    borderWidth: 0.19,
    borderColor: Colors.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  leftIcon: {position: 'absolute', height: 15, width: 15, left: 10},
  loader: {position: 'absolute', right: 10},
  userRow: {
    flexDirection: 'row',
  },
  loginText: {
    alignSelf: 'center',
    marginLeft: 10,
  },
});

export default SearchInput;
