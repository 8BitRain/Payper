import { Animated, Dimensions } from 'react-native'
const dims = Dimensions.get('window')

exports.shrink = function(tile, animatedValues, cb) {
  let { widths } = animatedValues
  let width = widths[tile]

  Animated.timing(width, {
    toValue: dims.width * 0.5,
    duration: 125
  }).start(() => (typeof cb === 'function') ? cb() : null)
}

exports.expand = function(tile, animatedValues, cb) {
  let { widths } = animatedValues
  let width = widths[tile]

  Animated.timing(width, {
    toValue: dims.width,
    duration: 125
  }).start(() => (typeof cb === 'function') ? cb() : null)
}

exports.hide = function(tiles, tileToSkip, animatedValues, cb) {
  let { heights, opacities } = animatedValues
  let animationSequence = []

  for (var i in tiles) {
    let tile = tiles[i]
    if (tile === tileToSkip) continue

    let height = heights[tile]
    let opacity = opacities[tile]

    animationSequence.push(
      Animated.parallel([
        Animated.timing(height, {
          toValue: 0,
          duration: 200
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100
        })
      ])
    )
  }

  Animated.parallel(animationSequence).start(() => (typeof cb === 'function') ? cb() : null)
}

exports.show = function(tiles, tileToSkip, animatedValues, cb) {
  let { heights, opacities } = animatedValues
  let animationSequence = []

  for (var i in tiles) {
    let tile = tiles[i]
    if (tile === tileToSkip) continue

    let height = heights[tile]
    let opacity = opacities[tile]

    animationSequence.push(
      Animated.parallel([
        Animated.timing(height, {
          toValue: dims.width * 0.5,
          duration: 200
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100
        })
      ])
    )
  }

  Animated.parallel(animationSequence).start(() => (typeof cb === 'function') ? cb() : null)
}
