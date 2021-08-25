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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import listSongs from '../model/data';
import TrackPlayer , { 
  RepeatMode, 
  State,
  Event,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Capability
} from 'react-native-track-player';
const {height, width} = Dimensions.get('window');


const setUpPlayers = async() => {   // thiết lập players 
    await TrackPlayer.setupPlayer()
     TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
    ],})
    await TrackPlayer.add(listSongs); // add songs in list queue
}

const musicPlay = async(playbackState) => {           // lấy ra bài nhạc đang phát
  const trackIndex = await TrackPlayer.getCurrentTrack();
  if(trackIndex != null ){
    if(playbackState == State.Paused){            /// nếu nó đang dừng thì nhấn sẽ phát
      await TrackPlayer.play();
    }
    else { 
      await TrackPlayer.pause(); //đang phát thì nhấn sẽ dừng
    }
  }
}
const MusicPlay = () => {
  const playbackState =  usePlaybackState(); //lấy ra trạng thái đang phát hay dừng của bài hát

  const progress = useProgress(); //tiến trình bài hát

  const skipNextSong = async(songIdex) => {    //chức năng next bài hát
    await TrackPlayer.skip(songIdex);
  }

  const scrollX = useRef(new Animated.Value(0)).current;  // useRef để lưu giá trị hiện tại {current}

  const [songIndex, setSongIndex] = useState(0);
 
  useEffect(() => {             //useEffect giống componenetDidMount,WillDidMount để sử lý sau khi mount
    setUpPlayers(); //goi ham` 
    scrollX.addListener(({value}) => {
      //thêm sự kiện cho scroll để lấy giá trị
      const index = Math.round(value / width); // lấy index;
      skipNextSong(index); //next bài hát
      setSongIndex(index);
    });
  
    return () => {
      scrollX.removeAllListeners();  // hủy sử kiện scroll
    };
  },[]);
  const songSlide = useRef(null);
  const [tittle, setTrackTitle] = useState(); //lấy title
  const [image,setTrackImage] = useState();
  const [author,setTrackAuthor] = useState();
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {         //bắt sự kiện khi kết thúc bài hát chuyển tiêu đề , tên tác giả..
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
        const track = await TrackPlayer.getTrack(event.nextTrack);
        const {title , image ,author} = track ;
        setTrackTitle(title);
        setTrackImage(image);
        setTrackAuthor(author);
    }
});
  const skipNext = () => {
    songSlide.current.scrollToOffset({
      offset:(songIndex+1)*width
    })
    // setHeart(false);
  }
  const skipPrevious = () => {
    songSlide.current.scrollToOffset({
      offset:(songIndex-1)*width
    });
    // setHeart(false);
  }
  
  const renderSong = ({index, item}) => {
    return (
      <Animated.View
        style={{width: width, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.imageWrapper}>
          <Image style={styles.image} source={image} />
        </View>
      </Animated.View>
    );
  };
  // const [heart,setHeart] = useState(false);
  const [repeatMode ,setRepeatMode] = useState('off');
  const repeatIcon = () => {
    if(repeatMode == 'off')
      return 'repeat-off'
    if(repeatMode == 'once')
      return 'repeat-once'
    return 'repeat'
  }
  const setRepeat = () => {
    if(repeatMode == 'off')
    {
      TrackPlayer.setRepeatMode(RepeatMode.Track)
      setRepeatMode('once');
    }
    if(repeatMode == 'once')
    {
      TrackPlayer.setRepeatMode(RepeatMode.Queue)
      setRepeatMode('repeat')
    }
    if(repeatMode == 'repeat')
    {
      TrackPlayer.setRepeatMode(RepeatMode.Off)
      setRepeatMode('off')
    }
  }
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
          <Text style={styles.title}>{tittle}</Text>
          <Text style={styles.author}>{author}</Text>
        </View>
        <View>
          <Slider
            style={styles.slider}
            value={progress.position} //vị trí của tiến trình
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#ffddd2"
            minimumTrackTintColor="#83c5be"
            maximumTrackTintColor="#ffffff"
            onSlidingComplete={async(value) => {
              await TrackPlayer.seekTo(value); //seeto tìm kiếm vị trí cụ thể trong player
            }}
          />
        </View>
        <View style={styles.timeWrapper}>
          <Text style={styles.timeStart}>{new Date(progress.position*1000).toISOString().substr(14,5)}</Text>
          <Text style={styles.timeEnd}>{new Date((progress.duration - progress.position)*1000).toISOString().substr(14,5)}</Text>
        </View>
        <View style={styles.controller}>
          <TouchableOpacity onPress={skipPrevious}>
            <Ionicons name="play-skip-back-outline" size={35} color="#fff" style={{marginTop:15}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress = {() => musicPlay(playbackState)}>
            <Ionicons name={playbackState === State.Playing ? "pause-circle-outline" : "play-circle-outline" } size={60} color="#fff"/>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipNext}>
            <Ionicons name="play-skip-forward-outline" size={35} color="#fff" style={{marginTop:15}} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.bottomControl}>
          <TouchableOpacity >
            <Ionicons name="heart-outline"  size={30} color= "#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress = {setRepeat}>
            <MaterialCommunityIcons name={repeatIcon()} size={30} color="#fff" />
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
     backgroundColor: '#0b0d23',
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
    shadowOpacity: 0.25,
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
    width: '55%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
