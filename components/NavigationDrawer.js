import React from 'react'
import Drawer from 'react-native-drawer'
import {SideMenu} from './'
import {Actions, DefaultRenderer} from 'react-native-router-flux'

class NavigationDrawer extends React.Component {
  render() {
    const state = this.props.navigationState
    const children = state.children

    return (
      <Drawer
        ref="navigation"
        open={state.open}
        onOpen={() => Actions.refresh({key: state.key, open: true})}
        onClose={() => Actions.refresh({key: state.key, open: false})}
        type="overlay"
        content={<SideMenu />}
        tapToClose={true}
        openDrawerOffset={0.275}
        panCloseMask={0.275}
        negotiatePan={true}
        tweenDuration={120}
        tweenHandler={(ratio) => ({
          main: {opacity: Math.max(0.54, 1 - ratio)}
        })}>
        <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
      </Drawer>
    )
  }
}

module.exports = NavigationDrawer
