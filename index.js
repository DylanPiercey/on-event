'use strict'

// In the server side we don't return any html.
module.exports = {
  on: function onEvent () { return '' },
  clear: function clear () {}
}
