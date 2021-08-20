import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';



const {height, width} = Dimensions.get('window');

const MusicPlay = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/e/0/2/c/e02cd4e0a723ed9b3510a95b5f6dbdd7.jpg',
            }}
          />
        </View>
        <View>
          <Text style={styles.title}>Tay To</Text>
          <Text style={styles.author}>Rapital,MCK,RPT PhongKhin</Text>
        </View>
        <View>
            <Slider
                style={styles.slider}
                value = {10}
                minimumValue={0}
                maximumValue={100}
                thumbTintColor = "#ffddd2"
                minimumTrackTintColor="#83c5be"
                maximumTrackTintColor="#ffffff"
                onSlidingComplete = {() => {}}
            />
        </View>
        <View style={styles.timeWrapper}>
                <Text style={styles.timeStart}>0:00</Text>
                <Text style={styles.timeEnd}>4:00</Text>
        </View>
        <View style={styles.controller}>
                <TouchableOpacity>
                    <Ionicons name="play-skip-back-outline" size = {35} color = "#fff" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="pause-outline" size = {35} color = "#fff" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="play-skip-forward-outline" size = {35} color = "#fff" />
                </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomControl}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="repeat" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={30}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d3557',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 300,
    height: 300,
    marginBottom:15,
    shadowColor: '#fff',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 350 / 2,
  },
  title: {
    fontSize: 18,
    color: '#eee',
    fontWeight: '500',
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '300',
    color: '#fff',
  },
  slider: {
      width:350,
      height:25,
      flexDirection:'row',
      marginTop:15,
  },
  timeWrapper : {
      width:330,
      flexDirection:'row',
      justifyContent: 'space-between',
      paddingHorizontal:5,
  },
  timeStart : {
      color: '#fff',
  },
  timeEnd: {
      color: '#fff',
  },
  controller : {
      width:'50%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop:10,
  }
  ,
  bottom: {
    width: width,
    borderTopWidth: 1,
    borderColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
  },
  bottomControl: {
    width: '80%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
