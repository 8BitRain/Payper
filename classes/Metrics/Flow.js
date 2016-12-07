class Flow {
  constructor(props) {
    if (props) for (var i in props) this[i] = props[i]
  }

  test() {
    console.log("Flow.test() was invoked...")
  }
}

module.exports = Flow
