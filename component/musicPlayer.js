import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import listSongs from '../model/data';

const {height, width} = Dimensions.get('window');

const MusicPlay = () => {
  const scrollX = useRef(new Animated.Value(0)).current;  // useRef để lưu giá trị hiện tại {current}
  const [songIndex, setSongIndex] = useState(0);
  useEffect(() => {             //useEffect giống componenetDidMount,WillDidMount để sử lý sau khi mount
    scrollX.addListener(({value}) => {
      //thêm sự kiện cho scroll để lấy giá trị
      const index = Math.round(value / width); // lấy index;
      setSongIndex(index);
    });
    return () => {
      scrollX.removeAllListeners();  // hủy sử kiện scroll
    };
  }, []);
  const songSlide = useRef(null);

  const skipNext = () => {
    songSlide.current.scrollToOffset({
      offset:(songIndex+1)*width
    })
  }
  const skipPrevious = () => {
    songSlide.current.scrollToOffset({
      offset:(songIndex-1)*width
    })
  }

  const renderSong = ({index, item}) => {
    return (
      <Animated.View
        style={{width: width, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={item.image} />
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <View style={{width:width}}>
          <Animated.FlatList
            ref={songSlide}
            data={listSongs}
            renderItem={renderSong}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled //dùng để phân từng trang tránh bị trượt
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true},
            )}
          />
        </View>
        <View>
          <Text style={styles.title}>{listSongs[songIndex].title}</Text>
          <Text style={styles.author}>{listSongs[songIndex].author}</Text>
        </View>
        <View>
          <Slider
            style={styles.slider}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#ffddd2"
            minimumTrackTintColor="#83c5be"
            maximumTrackTintColor="#ffffff"
            onSlidingComplete={() => {}}
          />
        </View>
        <View style={styles.timeWrapper}>
          <Text style={styles.timeStart}>0:00</Text>
          <Text style={styles.timeEnd}>4:00</Text>
        </View>
        <View style={styles.controller}>
          <TouchableOpacity onPress={skipPrevious}>
            <Ionicons name="play-skip-back-outline" size={35} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="pause-outline" size={35} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipNext}>
            <Ionicons name="play-skip-forward-outline" size={35} color="#fff" />
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
    marginBottom: 15,
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
    borderRadius: 300 / 2,
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
    paddingVertical: 5,
  },
  slider: {
    width: 350,
    height: 25,
    flexDirection: 'row',
    marginTop: 15,
  },
  timeWrapper: {
    width: 330,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  timeStart: {
    color: '#fff',
  },
  timeEnd: {
    color: '#fff',
  },
  controller: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  bottom: {
    width: width,
    borderTopWidth: 0.5,
    borderColor: '#eee',
    paddingVertical: 15,
    alignItems: 'center',
  },
  bottomControl: {
    width: '80%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
