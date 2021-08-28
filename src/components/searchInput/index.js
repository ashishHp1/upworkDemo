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
} from 'react-native';

import debounce from 'lodash.debounce';

import {DeviceHeight} from '../../utils';
import {Colors} from '../../theme/color';
import {CONFIG} from '../../../config';

const SearchInput = ({inputStyle, placeholder}) => {
  let _requests = [];

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
        `${CONFIG.API_URL}${text}&access_token=${CONFIG.Github_token}`,
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
    _onChangeText(text);
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
    const {login} = rowData;
    return (
      <Text style={[styles.description]} numberOfLines={4}>
        {login}
      </Text>
    );
  };

  const _renderLoader = rowData => {
    if (rowData.isLoading === true) {
      return <View style={[styles.loader]}>{_getRowLoader()}</View>;
    }

    return null;
  };

  const _renderSeparator = (sectionID, rowID) => {
    if (rowID === userData.length - 1) {
      return null;
    }

    return <View key={`${sectionID}-${rowID}`} style={[styles.separator]} />;
  };

  const _renderListEmptyComponent = () => {
    return <></>;
  };

  const _renderRow = (rowData = {}, index) => {
    return (
      <ScrollView
        contentContainerStyle={{width: '100%', height: '40%'}}
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
      <TextInput
        style={[styles.input, inputStyle]}
        value={stateText}
        placeholder={placeholder}
        onChangeText={_handleChangeText}
        onFocus={e => {
          _onFocus();
        }}
        onBlur={e => {
          _onBlur(e);
        }}
      />
      {isLoading ? <Text>.....Loading</Text> : null}
      {_getFlatList()}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: DeviceHeight * 0.055,
    // backgroundColor: Colors.grey,
    color: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    borderWidth: 0.19,
    borderColor: '#fafafa',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#c8c7cc',
  },
  row: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    minHeight: 44,
    flexDirection: 'row',
  },
  description: {},
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  flatList: {
    height: DeviceHeight * 0.35,
    // borderWidth: 1,
  },
});

export default SearchInput;
