import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import MusicPlay from './component/musicPlayer';

const App = () => {
  return (
    <View style={styles.container}>
      <MusicPlay />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
