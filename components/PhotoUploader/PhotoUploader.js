// Dependencies
import React from 'react';
import { View, Animated } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../styles/colors';
import * as Headers from '../../helpers/Headers';

// Additional Components
import CameraRollPicker from 'react-native-camera-roll-picker';

// Components
import UserPic from '../Previews/UserPic/UserPic';

// Partial components
import Header from '../../components/Header/Header';

//Custom
const dimensions = Dimensions.get('window');

class PhotoUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
      title: this.props.title,
      index: this.props.index,
      image: this.props.image,
      num: 0,
      selected: []
    };
  }

  componentDidMount() {
    Animated.spring(this.state.opacity, {
      toValue: 1.0,
      velocity: 4.0,
    }).start();
  }

  componentWillUnmount() {
    Animated.spring(this.state.opacity, {
      toValue: 0.0,
      velocity: 4.0
    }).start();
  }

  getSelectedImages(images, current) {
   var num = images.length;

   this.setState({
     num: num,
     selected: images,
   });

   console.log(current);
   console.log(this.state.selected);
 }

  _renderImageAndCameraRoll(){
    return(
      <View>
        <View>
          <Image></Image>
        </View>
        <View>
          <CameraRollPicker
         scrollRenderAheadDistance={500}
         initialListSize={1}
         pageSize={3}
         removeClippedSubviews={false}
         groupTypes='SavedPhotos'
         batchSize={5}
         maximum={3}
         selected={this.state.selected}
         assetType='Photos'
         imagesPerRow={3}
         imageMargin={5}
         callback={this.getSelectedImages.bind(this)} />
        </View>
      </View>
    );
  }

  _renderDocumentUploadExplanation(){

  }

  _renderCamera(){

  }

  render() {
    return(
      { /* Header */ }
      <View style={{flex: (dimensions.height < 667) ? 0.12 : 0.1}}>
        <Header
          //callbackClose={() => this._toggleModal()}
          headerProps={Headers.get({ header: "PhotoUpload", title: this.state.title, index: this.state.index })} />
      </View>
      <View>

      </View>
    );
  }
};

export default PhotoUploader;
