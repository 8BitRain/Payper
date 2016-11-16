// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import GridView from "react-native-easy-grid-view";
import FlipCard from 'react-native-flip-card'

// Stylesheets
import styles from './styles';
import colors from '../../styles/colors';

// Partial components
import Header from '../../components/Header/Header';
import * as Headers from '../../helpers/Headers';

//Custom
const dimensions = Dimensions.get('window');

export default class TrendingPayments extends React.Component {
  constructor(props) {
    super(props);
    this.height = new Animated.Value(0);

    var ds = new GridView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      index: 0,
      dataSource: ds.cloneWithCells([
        {
            text: "Spotify",
            backgroundColor:'#f0f',
            hasLogo: true,
            name: 'Spotify',
            percent: "75%"
        }
        , {
            text: "Netflix",
            backgroundColor:colors.white,
            hasLogo: true,
            name: "Netflix",
            percent: "50%"

        }, {
            text: "GameFly",
            backgroundColor:colors.white,
            hasLogo: true,
            name: "GameFly",
            percent: "23%"

        }, {
            text: "Rent",
            backgroundColor:'#f0f',
            icon: "flame",
            hasLogo: false,
            percent: "40%"

        }, {
            text: "ToiletPaper",
            backgroundColor:'#f0f',
            icon: "",
            hasLogo: false,
            percent: "20%"

        }, {
            text: "Internet",
            backgroundColor:colors.white,
            icon: "",
            hasLogo: false,
            percent: "30%"

        }], 2),
    cellWidth: 0,
    cellHeight: 0
    };


  }

  componentDidMount() {

  }
    _renderLogo(name){
      switch (name) {
        case "Spotify":
          return(
            <Image style={{width: 48, height: 48, alignSelf: "center"}} source={require('../../assets/images/Spotify_logo.png')}></Image>
          );
          break;
        case "Netflix":
          return(
            <Image style={{width: 48, height: 48, alignSelf: "center"}} source={require('../../assets/images/Netflix-logo.jpg')}></Image>
          );
          break;
        case "GameFly":
          return(
            <Image style={{width: 48, height: 48, alignSelf: "center"}} source={require('../../assets/images/GameFlyLogo.png')}></Image>
          );
          break;
      }
    }
    _renderCell(cell) {
       return (
         <View onLayout={event => {
           var width = event.nativeEvent.layout.width;
           if(this.state.cellWidth!=width){
            this.setState({cellWidth:width})
          }
          if(this.state.cellHeight!=width){
            this.setState({cellHeight:width})
          }
        }}>
           <FlipCard
            style={{padding: 0, margin: 0}}
            flipHorizontal={true}
            flipVertical={false}

           >
            { /* Front of card displays a service's Logo, Name, and Percentage of users splitting */}
             <View style={{width:this.state.cellWidth,height:this.state.cellHeight,justifyContent:'center',backgroundColor:cell.backgroundColor}}
                    resizeMode={Image.resizeMode.stretch} source={cell.image}>
                 {cell.hasLogo ? this._renderLogo(cell.name) : null}
                 <Text style={{textAlign:'center',color:colors.richBlack,fontSize:24}}>{cell.text}</Text>
                 <Text style={{textAlign:'center',color:colors.richBlack,fontSize:24}}>{cell.percent}</Text>
             </View>
            { /* Back of card displays a service's Logo, Name, and Percentage of users splitting */}
             <View style={{width:this.state.cellWidth,height:this.state.cellHeight,justifyContent:'center',backgroundColor:cell.backgroundColor}} resizeMode={Image.resizeMode.stretch} source={cell.image}>
              <Text style={{textAlign:'center',color:colors.richBlack,fontSize:24}}>{"Back"}</Text>
             </View>
           </FlipCard>
       </View>)
       ;
   }

  render() {
    return(
      <View style={{backgroundColor: colors.richBlack, width: dimensions.width, height: dimensions.height}}>
        <Header
          //callback
          callbackClose={() => this.props.toggleModal()}
          callbackBack={() => this.setState({index: this.state.index - 1})}
          headerProps={Headers.get({ header: "photoUpload", title: this.state.title, index: this.state.index })} />
          <GridView dataSource={this.state.dataSource} spacing={0} style={{marginTop:65, padding: 0, backgroundColor: colors.richBlack}} renderCell={this._renderCell.bind(this)}
          />
          { /*Alternate Design With Padding*/ }
          { /*<GridView dataSource={this.state.dataSource} spacing={8} style={{marginTop:65, padding: 5, backgroundColor: colors.richBlack}} renderCell={this._renderCell.bind(this)}
          />*/ }
      </View>
    );
  }
}
