// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
            front: {
              text: "Spotify",
              backgroundColor:colors.richBlack,
              textColor: colors.white,
              hasLogo: true,
              name: 'Spotify',
              percent: "75%"
            },
            back:{
              avgSent: "$7",
              avgDuration: "3 months",
              bestSplit: "2"
            }
        }
        , {
            front: {
              text: "Netflix",
              backgroundColor:colors.white,
              textColor: colors.richBlack,
              hasLogo: true,
              name: "Netflix",
              percent: "50%",

            },
            back:{
              avgSent: "$3",
              avgDuration: "12 months",
              bestSplit: "4"
            }
        }, {
            front:{
              text: "GameFly",
              backgroundColor:colors.white,
              textColor: colors.richBlack,
              hasLogo: true,
              name: "GameFly",
              percent: "23%"
            },
            back:{
              avgSent: "$6.50",
              avgDuration: "3 months",
              bestSplit: "2"
            }
        }, {
            front:{
              text: "Rent",
              backgroundColor:colors.richBlack,
              textColor: colors.white,
              icon: "ios-flame",
              iconColor: colors.white,
              hasLogo: false,
              percent: "40%",

            },
            back:{
              avgSent: "$400",
              avgDuration: "12 months",
              bestSplit: "2 - 6"
            }
        }, {
            front:{
              text: "ToiletPaper",
              backgroundColor:colors.richBlack,
              textColor: colors.white,
              icon: "ios-leaf",
              iconColor: colors.white,
              hasLogo: false,
              percent: "20%",

            },
            back:{
              avgSent: "$2",
              avgDuration: "12 months",
              bestSplit: "2 - 4"
            }

        }, {
            front:{
              text: "Internet",
              backgroundColor:colors.white,
              textColor: colors.richBlack,
              icon: "md-globe",
              iconColor: colors.richBlack,
              hasLogo: false,
              percent: "30%"
            },
            back:{
              avgSent: "$5",
              avgDuration: "12 months",
              bestSplit: "2 - 4"
            }

        }], 2),
    cellWidth: 0,
    cellHeight: 0
    };


  }

  componentDidMount() {

  }

  /* TODO Configure to loop through a json datastructure to remove hardcoded values*/
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
            style={{padding: 0, margin: 0, borderWidth: 0}}
            flipHorizontal={true}
            flipVertical={false}
            alignWidth={true}

           >
            { /* Front of card displays a service's Logo, Name, and Percentage of users splitting */}
             <View style={{width:this.state.cellWidth,height:this.state.cellHeight,justifyContent:'center',backgroundColor:cell.front.backgroundColor}}
                    resizeMode={Image.resizeMode.stretch} source={cell.image}>
                 <Image style={{width: 16, height: 16, alignSelf: "flex-end", marginRight: 4}} source={require('../../assets/images/OvalRed.png')}></Image>
                 {cell.front.hasLogo ? this._renderLogo(cell.front.name) : <Ionicons style={{alignSelf: "center"}}size={48} color={cell.front.iconColor} name={cell.front.icon}/>}
                 <Text style={{textAlign:'center',color:cell.front.textColor,fontSize:24}}>{cell.front.text}</Text>
                 <Text style={{textAlign:'center',color:cell.front.textColor,fontSize:24}}>{cell.front.percent}</Text>
             </View>
            { /* Back of card displays a service's Logo, Name, and Percentage of users splitting */}
             <View style={{width:this.state.cellWidth,height:this.state.cellHeight,justifyContent:'flex-start', alignItems: 'flex-start', backgroundColor:cell.front.backgroundColor}} resizeMode={Image.resizeMode.stretch} source={cell.image}>
              <Text style={{textAlign:'left',color:cell.front.textColor,fontSize:16}}>{"Users usually spent " + cell.back.avgSent}</Text>
              <Text style={{textAlign:'left',color:cell.front.textColor,fontSize:16}}>{"Split service usually lasted " + cell.back.avgDuration}</Text>
              <Text style={{textAlign:'left',color:cell.front.textColor,fontSize:16}}>{"This service is best split between " + cell.back.bestSplit + " people"}</Text>
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
          headerProps={Headers.get({ header: "photoUpload", title: "Trending Payments", index: this.state.index })} />
          <GridView dataSource={this.state.dataSource} spacing={0} style={{marginTop:65, padding: 0, backgroundColor: colors.richBlack}} renderCell={this._renderCell.bind(this)}
          />
          { /*Alternate Design With Padding*/ }
          { /*<GridView dataSource={this.state.dataSource} spacing={8} style={{marginTop:65, padding: 5, backgroundColor: colors.richBlack}} renderCell={this._renderCell.bind(this)}
          />*/ }
      </View>
    );
  }
}
