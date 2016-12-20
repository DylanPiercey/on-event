'use strict'

var hash = require('hash-sum')
var NS = '__on-event__'
var PREFIX = 'data-on' // A safe attribute PREFIX to store event handler ids.
var _REGISTERED = {} // Stores currently registered event handler id's and there functions.

// Patch event propogation (cancelBubble).
var event = window.Event.prototype
event[NS] = event.stopPropagation
event.stopPropagation = function stopPropagation () {
  this.cancelBubble = true
  return this[NS]()
}

// Expose library.
module.exports = {
  on: onEvent,
  clear: clear
}

/**
 * @description
 * Registers a given handler function to the list of registered event handlers.
 *
 * @param {Function} fn - The event handler function
 * @return {String} id of the event handler.
 */
function onEvent (name, fn) {
  return registerEvent(name, fn)
}

/**
 * @description
 * Clears all registered event handlers.
 */
function clear () {
  for (var name in _REGISTERED) {
    _REGISTERED[name] = {}
  }
}

/**
 * @description
 * Registers a given handler function to the list of registered event handlers.
 *
 * @param {Function} fn - The event handler function
 * @return {String} id of the event handler.
 */
function registerEvent (name, fn) {
  assert(typeof name === 'string', 'Event name must be a string')
  assert(typeof fn === 'function', 'Event handler must be a function')
  var id = fn[NS] = getCallingId()

  // Lazily register event delegators.
  if (!_REGISTERED[name]) {
    _REGISTERED[name] = {}
    document.addEventListener(name, handleEvent, true)
  }

  _REGISTERED[name][id] = fn
  return PREFIX + name + '=' + id
}

/*
 * @private
 * @description
 * Handle and delegate global events.
 *
 * @param {Event} e - The DOM event being handled.
 */
function handleEvent (e) {
  var name = e.type.toLowerCase()
  var attr = PREFIX + name
  var target = e.target
  var handlers = _REGISTERED[name]

  // Ignore events with no registered handlers.
  if (!handlers) return

  // Look through nodes for registered handlers.
  do {
    var id = target.getAttribute(attr)
    var handler = handlers[id]
    if (!handler) continue
    Object.defineProperty(e, 'currentTarget', { value: target })
    handler(e)
    if (e.cancelBubble) break
    target = target.parentNode
  } while (e.bubbles && target !== document)
}

/**
 * Gets an id for a function call by looking up the stack trace and getting the line/column.
 */
function getCallingId () {
  return hash((new Error()).stack)
}

/**
 * @description
 * Assert that a val is truthy and throw an error if not.
 *
 * @param {*} val - the value to test for truthyness.
 * @param {String} msg - the message that will be thrown on failure.
 * @throws {TypeError} err - throws an error if the value is not truthy.
 */
function assert (val, msg) {
  if (val) return
  throw new TypeError('on-event: ' + msg)
}
