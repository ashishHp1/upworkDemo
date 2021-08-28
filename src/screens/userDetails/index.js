import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';

const UserDetails = ({route: {params}}) => {
  const {userData} = params;

  return (
    <WebView
      source={{
        uri: userData.html_url,
      }}
      startInLoadingState={true}
      renderLoading={() => (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <ActivityIndicator animating={true} size="large" color="#2980b9" />
        </View>
      )}
    />
  );
};

export default UserDetails;
