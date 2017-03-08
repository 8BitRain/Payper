function callbackForLoop(start, stop, params) {
  if (start === stop) {
    params.onComplete()
    return
  }

  params.onIterate({
    index: start,
    continue: () => callbackForLoop(start + 1, stop, params),
    stop: () => { params.onComplete(); return }
  })
}

module.exports = callbackForLoop
