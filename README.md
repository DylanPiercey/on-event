# on-event
Easier event delegation for universal HTML based apps. Allows for inline event handling with pure html.


# Installation

```console
npm install on-event
```

# Example

```js
import { on, clear } from 'on-event'
import html from 'as-html'

// Register an event handler inline.
html`
  <div ${on('click', ()=> console.log('Clicked!'))}>
    Hello World!
  </div>
` //-> '<div data-onclick="104167580">Hello world</div>'
```

# How it works
Every time you call `on(event, handler)` it will return a string with an attribute and an id. This id will be used in event delegation to allow for your events to be handled.

However since every time you call `on` you are adding a new delegated event handler you must clear the handlers on every render to help garbage collection.

The library exposes a `clear()` function which will clear all registered event handlers, allowing them to be garbage collected.

```js
// Clear old event handlers (should be done in a render loop of some kind).
on.clear()
// Register new handlers!
```

### Contributions

* Use `npm test` to run tests.

Please feel free to create a PR!
