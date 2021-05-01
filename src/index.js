const Task = require('./task')
const Either = require('./either')

const log = label => value => (console.log(`${label}: ${JSON.stringify(value, null, 2)}`), value)

const curry = (fn) => {
    return function f1(...args) {
        return args.length >= fn.length
            ? fn(...args)
            : (...moreArgs) => f1(...[...args, ...moreArgs])
    }
}

const map = curry((f, x) => x.map(f))

const mapLeft = f => e => e.mapLeft(f)

const fold = (f, g) => e => e.fold(f, g)

const chain = f => e => e.chain(f)

const chainLeft = f => e => e.chainLeft(f)

const ap = b2 => e => e.ap(b2)

const fork = reject => resolve => b => b.fork(reject, resolve)

const asyncPipe = fns => x => fns.reduce(async (v, f) => f(await v), x)

const pipe = fns => x => fns.reduce((v, f) => f(v), x)


module.exports = {
  asyncPipe,
  pipe,
  Either,
  map,
  mapLeft,
  chain,
  chainLeft,
  fold,
  ap,
  Task,
  fork,
  log,
}

