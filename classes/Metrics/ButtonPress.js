class ButtonPress {
  constructor(props) {
    if (props) for (var i in props) this[i] = props[i]
  }

  test() {
    console.log("ButtonPress.test() was invoked...")
  }
}

module.exports = ButtonPress
