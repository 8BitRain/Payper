import React from 'react'
import {Image} from 'react-native'

function getLogo(tag) {
  let logo

  switch (tag) {
    case "audible": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/audible.png")} />; break;
    case "blinkist": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/blinkist.png")} />; break;
    case "marvelmagazine": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/marvelmagazine.png")} />; break;
    case "blueapron": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/blueapron.png")} />; break;
    case "butcherbox": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/butcherbox.png")} />; break;
    case "vinebox": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/vinebox.png")} />; break;
    case "gamefly": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/gamefly.png")} />; break;
    case "ignprime": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/ignprime.png")} />; break;
    case "xboxlive": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/xboxlive.png")} />; break;
    case "psvue": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/psvue.png")} />; break;
    case "slingtv": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/slingtv.png")} />; break;
    case "spotify": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/spotify.png")} />; break;
    case "popularscience": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/popularscience.png")} />; break;
    case "vinebox": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/vinebox.png")} />; break;
    case "nbaleaguepass": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/nbaleaguepass.png")} />; break;
    case "nhltv": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/nhltv.png")} />; break;
    case "cbs": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/cbs.png")} />; break;
    case "chegg": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/chegg.png")} />; break;
    case "crunchyroll": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/crunchyroll.png")} />; break;
    case "dailyburn": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/dailyburn.png")} />; break;
    case "espninsider": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/espninsider.png")} />; break;
    case "fandor": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/fandor.png")} />; break;
    case "gaiayoga": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/gaiayoga.png")} />; break;
    case "hbonow": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/hbonow.png")} />; break;
    case "headspace": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/headspace.png")} />; break;
    case "hulu": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/hulu.png")} />; break;
    case "mubi": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/mubi.png")} />; break;
    case "netflix": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/netflix.png")} />; break;
    case "nyt": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/nyt.png")} />; break;
    case "showtime": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/showtime.png")} />; break;
    case "spuul": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/spuul.png")} />; break;
    case "starz": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/starz.png")} />; break;
    case "sundance": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/sundance.png")} />; break;
    case "tidal": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/tidal.png")} />; break;
    case "viki": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/viki.png")} />; break;
    case "warner": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/warner.png")} />; break;
    case "wwenetwork": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/wwenetwork.png")} />; break;
    case "yogaglo": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/yogaglo.png")} />; break;
    case "youtubetv": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/youtubetv.png")} />; break;
    case "youtubered": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/youtubered.png")} />; break;
    case "tuneinpremium": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/tuneinpremium.png")} />; break;
    // NOTE: These logos are missing...
    // case "litbox": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/litbox.png")} />; break;
    // case "craftbeerclub": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/craftbeerclub.png")} />; break;
    // case "texture": logo = <Image style={{width: 43, height: 43}} source={require("../../assets/images/logos/texture.png")} />; break;
  }

  return logo
}

module.exports = getLogo
