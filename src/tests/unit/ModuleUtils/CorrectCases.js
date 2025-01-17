/* global describe, test, expect */

export default (utilsModule) => {
  describe('utils - Correct use cases.\n  Utils:', () => {
    describe('makeResponse', () => {
      test('with an arrow function', () => {
        const actual = utilsModule.makeResponse(() => 'a')
        const expected = `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      let msg = (function () {return 'a';}).apply(null, args)
      if (msg instanceof Promise) msg.then(self.postMessage)
      else self.postMessage(msg)
      return close()
    }
    let msg = (function () {return 'a';})()
    if (msg instanceof Promise) msg.then(self.postMessage)
    else self.postMessage(msg)
    return close()
  }
`
        expect(actual).toBe(expected)
      })
      test('with an async arrow function', () => {
        const actual = utilsModule.makeResponse(async () => 'a')
        const expected = `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      let msg = (function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});}).apply(null, args)
      if (msg instanceof Promise) msg.then(self.postMessage)
      else self.postMessage(msg)
      return close()
    }
    let msg = (function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});})()
    if (msg instanceof Promise) msg.then(self.postMessage)
    else self.postMessage(msg)
    return close()
  }
`
        expect(actual).toBe(expected)
      })
      test('with an async  function expression', () => {
        const actual = utilsModule.makeResponse(async function () { return 'a' })
        const expected = `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      let msg = (function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});}).apply(null, args)
      if (msg instanceof Promise) msg.then(self.postMessage)
      else self.postMessage(msg)
      return close()
    }
    let msg = (function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});})()
    if (msg instanceof Promise) msg.then(self.postMessage)
    else self.postMessage(msg)
    return close()
  }
`
        expect(actual).toBe(expected)
      })
      test('with a function expression', () => {
        const actual = utilsModule.makeResponse(function () { return 'a' })
        const expected = `
  self.onmessage = function(event) {
    const args = event.data.message.args
    if (args) {
      let msg = (function () {return 'a';}).apply(null, args)
      if (msg instanceof Promise) msg.then(self.postMessage)
      else self.postMessage(msg)
      return close()
    }
    let msg = (function () {return 'a';})()
    if (msg instanceof Promise) msg.then(self.postMessage)
    else self.postMessage(msg)
    return close()
  }
`
        expect(actual).toBe(expected)
      })
    })

    describe('argumentError', () => {
      describe('pass try', () => {
        test('Passing expected, received and extraInfo', () => {
          const options = {
            expected: 'expected',
            received: 'received',
            extraInfo: 'extraInfo'
          }
          const actual = utilsModule.argumentError(options)
          const expected = new TypeError('You should provide expected\nextraInfo\nReceived: "received"')
          expect(actual).toEqual(expected)
        })

        test('Passing expected and received', () => {
          const options = {
            expected: 'expected',
            received: 'received'
          }
          const actual = utilsModule.argumentError(options)
          const expected = new TypeError('You should provide expected\n\nReceived: "received"')
          expect(actual).toEqual(expected)
        })

        test('Passing expected and extraInfo', () => {
          const options = {
            expected: 'expected',
            extraInfo: 'extraInfo'
          }
          const actual = utilsModule.argumentError(options)
          const expected = new TypeError('You should provide expected\nextraInfo\nReceived: undefined')
          expect(actual).toEqual(expected)
        })

        test('Passing received and extraInfo', () => {
          const options = {
            received: 'received',
            extraInfo: 'extraInfo'
          }
          const actual = utilsModule.argumentError(options)
          const expected = new TypeError('You should provide \nextraInfo\nReceived: "received"')
          expect(actual).toEqual(expected)
        })
      })

      test('fail try with circular structure', () => {
        const options = {
          expected: 'expected',
          received: null,
          extraInfo: 'extraInfo'
        }
        options.received = options
        const actual = utilsModule.argumentError(options)
        const expected = new TypeError('You should provide expected\nextraInfo\nReceived a circular structure: [object Object]')
        expect(actual).toEqual(expected)
      })
    })

    describe('isValid', () => {
      describe('types is not an Array', () => {
        test('string', () => {
          const actual = utilsModule.isValid('string')('string')
          expect(actual).toBe(true)
        })

        test('object', () => {
          const actual = utilsModule.isValid({ an: 'object' })('object')
          expect(actual).toBe(true)
        })

        test('array', () => {
          const actual = utilsModule.isValid(['array'])('array')
          expect(actual).toBe(true)
        })

        test('number', () => {
          const actual = utilsModule.isValid(1)('number')
          expect(actual).toBe(true)
        })

        test('function', () => {
          const actual = utilsModule.isValid(() => 'a')('function')
          expect(actual).toBe(true)
        })

        test('undefined', () => {
          const actual = utilsModule.isValid()('undefined')
          expect(actual).toBe(true)
        })

        test('null', () => {
          const actual = utilsModule.isValid(null)('null')
          expect(actual).toBe(true)
        })

        test('action', () => {
          const actual = utilsModule.isValid({ message: 'a', func: () => 'a' })('action')
          expect(actual).toBe(true)
        })

        test('actionsArray', () => {
          const actions = [
            { message: 'a', func: () => 'a' },
            { message: 'b', func: () => 'b' }
          ]
          const actual = utilsModule.isValid(actions)('actionsArray')
          expect(actual).toBe(true)
        })

        test('arraysArray', () => {
          const arrays = [['a'], ['b']]
          const actual = utilsModule.isValid(arrays)('arraysArray')
          expect(actual).toBe(true)
        })

        test('objectsArray', () => {
          const objects = [
            { message: 'a' },
            { func: () => 'b' }
          ]
          const actual = utilsModule.isValid(objects)('objectsArray')
          expect(actual).toBe(true)
        })

        test('postParamsArray', () => {
          const postParams = [
            { message: 'a', args: ['a'] },
            { message: 'b', args: ['b'] }
          ]
          const actual = utilsModule.isValid(postParams)('postParamsArray')
          expect(actual).toBe(true)
        })

        test('stringsArray', () => {
          const strings = ['a', 'b']
          const actual = utilsModule.isValid(strings)('stringsArray')
          expect(actual).toBe(true)
        })
      })

      describe('types is an Array', () => {
        describe(`['array', 'undefined']`, () => {
          test('array', () => {
            const actual = utilsModule.isValid([])(['array', 'undefined'])
            expect(actual).toBe(true)
          })

          test('undefined', () => {
            const actual = utilsModule.isValid()(['array', 'undefined'])
            expect(actual).toBe(true)
          })
        })

        describe(`['string', 'stringsArray']`, () => {
          test('string', () => {
            const actual = utilsModule.isValid('string')(['string', 'stringsArray'])
            expect(actual).toBe(true)
          })

          test('stringsArray', () => {
            const actual = utilsModule.isValid(['string', 'stringsArray'])(['string', 'stringsArray'])
            expect(actual).toBe(true)
          })
        })

        describe(`['action', 'actionsArray']`, () => {
          test('action', () => {
            const actual = utilsModule.isValid({ message: 'a', func: () => 'a' })(['action', 'actionsArray'])
            expect(actual).toBe(true)
          })

          test('actionsArray', () => {
            const actions = [
              { message: 'a', func: () => 'a' },
              { message: 'b', func: () => 'b' }
            ]
            const actual = utilsModule.isValid(actions)(['action', 'actionsArray'])
            expect(actual).toBe(true)
          })
        })

        describe(`['arraysArray', 'postParamsArray', 'stringsArray']`, () => {
          test('arraysArray', () => {
            const arrays = [['a'], ['b']]
            const actual = utilsModule.isValid(arrays)(['arraysArray', 'postParamsArray', 'stringsArray'])
            expect(actual).toBe(true)
          })

          test('postParamsArray', () => {
            const postParams = [
              { message: 'a', args: ['a'] },
              { message: 'b', args: ['b'] }
            ]
            const actual = utilsModule.isValid(postParams)(['arraysArray', 'postParamsArray', 'stringsArray'])
            expect(actual).toBe(true)
          })

          test('stringsArray', () => {
            const strings = ['a', 'b']
            const actual = utilsModule.isValid(strings)(['arraysArray', 'postParamsArray', 'stringsArray'])
            expect(actual).toBe(true)
          })
        })
      })
    })
  })
}
