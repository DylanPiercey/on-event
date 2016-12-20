'use strict'

var cleanup = require('jsdom-global')()
var test = require('tape')
var html = require('as-html')
var event = require('../browser')

test('handle event', function (t) {
  t.plan(1)

  document.body.innerHTML = html`<div ${event.on('click', handleClick)}>Hello</div>`
  var div = document.body.querySelector('div')
  div.click()

  function handleClick (e) {
    t.equal(e.target, div, 'div was clicked')
    event.clear()
    div.click()
    cleanup()
  }
})
