import test from 'tape';
import proc from '../../src/internal/proc'
import * as io from '../../src/effects'
import {emitter, channel} from '../../src/internal/channel'


test('proc put handling', assert => {
  assert.plan(1)

  let actual = []
  const dispatch = v => actual.push(v)

  function* genFn(arg) {
    yield io.put(arg)
    yield io.put(2)
  }

  // proc(genFn('arg'), undefined, dispatch).done.catch(err => assert.fail(err))
  // API-incompatible change: for IE8 compatibility. Use property `done` in original redux-saga
  proc(genFn('arg'), undefined, dispatch).done().catch(err => assert.fail(err))

  const expected = ['arg', 2];
  setTimeout(() => {
    assert.deepEqual(actual, expected,
      "proc must handle generator puts"
    );
    assert.end();
  })

});

test('proc put in a channel', assert => {
  assert.plan(1)

  const buffer = []
  const spyBuffer = {
    isEmpty: () => !buffer.length,
    put: (it) => buffer.push(it),
    take: () => buffer.shift()
  }
  const chan = channel(spyBuffer)

  function* genFn(arg) {
    yield io.put(chan, arg)
    yield io.put(chan, 2)
  }

  // proc(genFn('arg')).done.catch(err => assert.fail(err))
  // API-incompatible change: for IE8 compatibility. Use property `done` in original redux-saga
  proc(genFn('arg')).done().catch(err => assert.fail(err))

  const expected = ['arg', 2];
  setTimeout(() => {
    assert.deepEqual(buffer, expected,
      "proc must handle puts on a given channel"
    );
    assert.end();
  })

});

test('proc async put\'s response handling', assert => {
  assert.plan(1)

  let actual = []
  const dispatch = v => Promise.resolve(v)

  function* genFn(arg) {
    actual.push(yield io.put.sync(arg))
    actual.push(yield io.put.sync(2))
  }

  // proc(genFn('arg'), undefined, dispatch).done.catch(err => assert.fail(err))
  // API-incompatible change: for IE8 compatibility. Use property `done` in original redux-saga
  proc(genFn('arg'), undefined, dispatch).done().catch(err => assert.fail(err))

  const expected = ['arg', 2];
  setTimeout(() => {
    assert.deepEqual(actual, expected,
      "proc must handle async responses of generator put effects"
    );
    assert.end();
  })

});

test('proc error put\'s response handling', assert => {
  assert.plan(1)

  let actual = []
  const dispatch = v => { throw 'error ' + v }

  function* genFn(arg) {
    try {
      actual.push(yield io.put(arg))
    } catch(err) {
      actual.push(err)
    }
  }

  // proc(genFn('arg'), undefined, dispatch).done.catch(err => assert.fail(err))
  // API-incompatible change: for IE8 compatibility. Use property `done` in original redux-saga
  proc(genFn('arg'), undefined, dispatch).done().catch(err => assert.fail(err))

  const expected = ['error arg'];
  setTimeout(() => {
    assert.deepEqual(actual, expected,
      "proc must handle thrown errors of generator put effects"
    );
    assert.end();
  })

});

test('proc nested puts handling', assert => {
  assert.plan(1)

  let actual = []
  const em = emitter()

  function* genA() {
    yield io.put({type: 'a'})
    actual.push('put a')
  }

  function* genB() {
    yield io.take('a')
    yield io.put({type: 'b'})
    actual.push('put b')
  }


  function* root() {
    yield io.fork(genB) // forks genB first to be ready to take before genA starts putting
    yield io.fork(genA)
  }

  // proc(root(), em.subscribe, em.emit).done.catch(err => assert.fail(err))
  // API-incompatible change: for IE8 compatibility. Use property `done` in original redux-saga
  proc(root(), em.subscribe, em.emit).done().catch(err => assert.fail(err))

  const expected = ['put a', 'put b'];
  setTimeout(() => {
    assert.deepEqual(actual, expected,
      "proc must order nested puts by executing them after the outer puts complete"
    );
    assert.end();
  })

});
