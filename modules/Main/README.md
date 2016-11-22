### **MainView.js**

## Adding a modal
`MainView.js` contains a generic modal that we can easily add pages to. To add a modal, add a case to the switch statement found in the getSideMenuSubpage function like this:
```javascript
getSideMenuSubpage(sp) {
  switch (sp) {
    // ...
    case "Modal Title": return <CustomComponent {...this.props} />
  }
}
```

## Opening the modal
The modal can be opened by calling the `toggleSideMenuSubpage` function with your modal's title as a paramater, like this:
```javascript
this.toggleSideMenuSubpage("Modal Title")
```

## Closing the modal
The modal can be closed like this:
```javascript
this.toggleSideMenuSubpage(null)
```

## Bypassing the modal's default header
The modal is, by default, rendered with generic header containing a title and close icon. To avoid rendering the modal's default header, add your modal's title to the `headerlessModalTitles` array found in `MainView.js`' constructor, like this:
```javascript
constructor(props) {
  super(props)
  // ...
  this.headerlessModalTitles = ["Modal Title"]
}
```
If you don't render a default header, be sure your component has access to the `toggleSideMenuSubpage` function via callback to be able to close itself.

## Adding empty state content
To add empty state content, manipulate the `generateEmptyState` function like this:
```javascript
generateEmptyState() {
  let emptyState = []

  emptyState.push({
    type: "priorityContent",
    reactComponent: <MyCustomComponent />
  })

  return emptyState
}
```
The component(s) returned by this function will be prepended to any empty payment lists.
