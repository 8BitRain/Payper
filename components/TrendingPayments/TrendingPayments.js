// Dependencies
import React from 'react';
import { View, Text, TouchableHighlight, Animated, Easing, Image, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import GridView from "react-native-easy-grid-view";
import FlipCard from 'react-native-flip-card'

// Stylesheets
import styles from './styles';
import {colors} from '../../globalStyles';

// Partial components
import Header from '../../components/Header/Header';
import * as Headers from '../../helpers/Headers';

//Custom
const dimensions = Dimensions.get('window');

class TrendingPayments extends React.Component {
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
              textColor: colors.snowWhite,
              hasLogo: true,
              name: 'Spotify',
              percent: ""
            },
            back:{
              avgSent: "$7",
              avgDuration: "3 mos.",
              per: "month",
              avgSplit: "2",
              textColor: colors.snowWhite,
            }
        }
        , {
            front: {
              text: "Netflix",
              backgroundColor:colors.medGrey,
              textColor: colors.richBlack,
              hasLogo: true,
              name: "Netflix",
              percent: "",

            },
            back:{
              avgSent: "$3",
              avgDuration: "12 mos.",
              per: "month",
              avgSplit: "4",
              textColor: colors.richBlack,
            }
        }, {
            front:{
              text: "GameFly",
              backgroundColor:colors.medGrey,
              textColor: colors.richBlack,
              hasLogo: true,
              name: "GameFly",
              percent: ""
            },
            back:{
              avgSent: "$6.50",
              avgDuration: "3 mos.",
              per: "month",
              avgSplit: "2",
              textColor: colors.richBlack
            }
        }, {
            front:{
              text: "Rent",
              backgroundColor:colors.richBlack,
              textColor: colors.snowWhite,
              icon: "ios-flame",
              iconColor: colors.accent,
              hasLogo: false,
              percent: "",

            },
            back:{
              avgSent: "$400",
              avgDuration: "12 mos.",
              per: "month",
              avgSplit: "6",
              textColor: colors.snowWhite
            }
        }, {
            front:{
              text: "Amazon Prime",
              name: "Amazon Prime",
              backgroundColor:colors.richBlack,
              textColor: colors.snowWhite,
              hasLogo: true,
              percent: "",

            },
            back:{
              avgSent: "$11",
              avgDuration: "12 mos.",
              avgSplit: "2",
              per: "month",
              textColor: colors.snowWhite
            }

        }, {
            front:{
              text: "Internet",
              backgroundColor:colors.medGrey,
              textColor: colors.richBlack,
              icon: "md-globe",
              iconColor: colors.accent,
              hasLogo: false,
              percent: ""
            },
            back:{
              avgSent: "$5",
              avgDuration: "12 mos.",
              avgSplit: "4",
              per: "month",
              textColor: colors.richBlack
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
            <Image style={{width: 48, height: 48, alignSelf: "center", borderRadius: 4}} source={require('../../assets/images/Netflix-logo.jpg')}></Image>
          );
          break;
        case "GameFly":
          return(
            <Image style={{width: 48, height: 48, alignSelf: "center", backgroundColor: "transparent", padding: 0, margin: 0}} source={require('../../assets/images/Gamefly_logo_notext.png')}></Image>
          );
          break;
        case "Amazon Prime":
          return(
            <Image style={{width: 48, height: 48, alignSelf: "center", backgroundColor: "transparent", borderRadius: 4}} source={require('../../assets/images/amazon_prime_logo.jpg')}></Image>
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
            style={{padding: 0, margin: 0, borderWidth: 0, borderRadius: 4, shadowColor: colors.snowWhite, shadowOpacity: 0, shadowRadius: 0, shadowOffset:{width: 0, height: 0}, borderColor: colors.accent}}
            flipHorizontal={true}
            flipVertical={false}
            alignWidth={true}

           >
            { /* Front of card displays a service's Logo, Name, and Percentage of users splitting */}
             <View style={{width:this.state.cellWidth,height:this.state.cellHeight * 1.1,justifyContent:'center', backgroundColor:cell.front.backgroundColor}}
                    resizeMode={Image.resizeMode.stretch} source={cell.image}>
                 {/*<Image style={{width: 16, height: 16, alignSelf: "flex-end", marginRight: 4}} source={require('../../assets/images/OvalRed.png')}></Image>*/}
                 {cell.front.hasLogo ? this._renderLogo(cell.front.name) : <Ionicons style={{alignSelf: "center"}}size={48} color={cell.front.iconColor} name={cell.front.icon}/>}
                 <Text style={{textAlign:'center',color:cell.front.textColor,fontSize:24}}>{cell.front.text}</Text>
                 <Text style={{textAlign:'center',color:cell.front.textColor,fontSize:24}}>{cell.front.percent}</Text>
             </View>
            { /* Back of card displays a service's Logo, Name, and Percentage of users splitting */}
             <View style={{width:this.state.cellWidth,height:this.state.cellHeight * 1.1,justifyContent:'center', alignItems: 'center', flexDirection: "column", backgroundColor:cell.front.backgroundColor}} resizeMode={Image.resizeMode.stretch} source={cell.image}>
              {/*<Text style={{textAlign:'left',color:cell.front.textColor,fontSize:16}}>{"Users usually spent " + cell.back.avgSent}</Text>
              <Text style={{textAlign:'left',color:cell.front.textColor,fontSize:16}}>{"Split service usually lasted " + cell.back.avgDuration}</Text>
              <Text style={{textAlign:'left',color:cell.front.textColor,fontSize:16}}>{"This service is best split between " + cell.back.avgSplit + " people"}</Text>*/}
              <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, paddingBottom: 10}}>On Average Users..</Text>
              <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column"}}>

                  <View style={styles.imageWrap}>
                    <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, backgroundColor: "transparent", alignSelf: "center"}}>Spent</Text>
                    <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, backgroundColor: "transparent", color: colors.accent}}>{cell.back.avgSent}</Text>
                  </View>
                </View>
                <View style={{flexDirection: "column"}}>

                <View style={styles.imageWrap}>
                  <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, backgroundColor: "transparent", alignSelf: "center"}}>Per</Text>
                  <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, backgroundColor: "transparent", color: colors.accent}}>{cell.back.per}</Text>
                </View>
                </View>
              </View>

              <View style={{flexDirection: "row"}}>
              <View style={{flexDirection: "column"}}>

                <View style={styles.imageWrap}>
                  <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, backgroundColor: "transparent", alignSelf: "center"}}>Over</Text>
                  <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, textAlign: "center", color: cell.back.textColor, backgroundColor: "transparent", color: colors.accent}}>{cell.back.avgDuration}</Text>
                </View>
              </View>
              <View style={{flexDirection: "column"}}>

                <View style={styles.imageWrap}>
                  <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, backgroundColor: "transparent", alignSelf: "center"}}>With</Text>
                  <Text style={{fontFamily: "Roboto", fontWeight: "400", fontSize: 16, color: cell.back.textColor, backgroundColor: "transparent", color: colors.accent}}>{cell.back.avgSplit} <Ionicons name="md-person" size={16}/></Text>

                </View>
              </View>
              </View>

             </View>
           </FlipCard>
       </View>
     );
   }

  render() {
    return(
      <View style={{backgroundColor: colors.snowWhite, width: dimensions.width, height: dimensions.height}}>
          <GridView dataSource={this.state.dataSource} spacing={0} style={{marginTop:0, padding: 0, backgroundColor: colors.medGrey}} renderCell={this._renderCell.bind(this)}
          />
          { /*Alternate Design With Padding*/ }
          { /*<GridView dataSource={this.state.dataSource} spacing={8} style={{marginTop:65, padding: 5, backgroundColor: colors.richBlack}} renderCell={this._renderCell.bind(this)}
          />*/ }
      </View>
    );
  }
}

module.exports = TrendingPayments
