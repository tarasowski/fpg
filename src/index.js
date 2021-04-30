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


const map = curry((f, x) =>
    Array.isArray(x)
        ? x.reduce((a, c) => a.concat([f(c)]), []) // map over regular arrays map(console.log, [1, 2, 3])
        : x.map(f) // map over types Either, Task // compose(map(f),map(f),fromNullable)(data)
)

const reduce = curry((fn, config, x) =>
    config === null
        ? x.reduce(fn)
        : x.reduce(fn, config))

const filter = curry((pred, xs) =>
    xs.reduce((newArr, item) => pred(item) ? newArr.concat([item]) : newArr, []))

const fold = (f, g) => e => e.fold(f, g)

const chain = f => e => e.chain(f)

const ap = b2 => e => e.ap(b2)

const fork = reject => resolve => b => b.fork(reject, resolve)

const asyncPipe = fns => x => fns.reduce(async (v, f) => f(await v), x)


module.exports = {
    curry,
    log,
    map,
    filter,
    reduce,
    Task,
    Either,
    fold,
    chain,
    ap,
    fork,
    asyncPipe
}
