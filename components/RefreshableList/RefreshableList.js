// class RefreshableList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       refreshing: false,
//     };
//   }
//
//   _onRefresh() {
//     this.setState({refreshing: true});
//     fetchData().then(() => {
//       this.setState({refreshing: false});
//     });
//   }
//
//   render() {
//     return (
//       <ListView
//         refreshControl={
//           <RefreshControl
//             refreshing={this.state.refreshing}
//             onRefresh={this._onRefresh.bind(this)}
//           />
//         }
//         ...
//       >
//       ...
//       </ListView>
//     );
//   }
//   ...
// }
