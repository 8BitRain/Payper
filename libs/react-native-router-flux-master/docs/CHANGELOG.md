# Change log
- 3.22.20 fix more ESLint errors, fix passing leftButtonStyle property for back button
- 3.22.18 fix some ESLint errors and ignore pop for root scene
- 3.22.17 allow jump & push together - now you could call Actions.tab2_2() (`tab2_2` is next scene after `tab2`) even if `tab2` is not active
- 3.22.16 simplified syntax for sub-states
- 3.22.15 introduces support for different states inside the same screen.
- 3.22.10 simplifies customization of own NavBar. From now you could import built-in NavBar from the component and customize it. You could set it globally to all scenes by setting `navBar` property for `Router` component.
For all other scenes you may pass rightButton, leftButton for custom buttons or rightTitle & onRight, leftTitle & onLeft for text buttons.