// Task
const compose = (...fns) => x =>
    fns.reduceRight((v, f) => f(v), x)


const fork = computation => ({ fork: computation })

// Functor
const map = o => ({
    ...o, ...{
        map(fn) {
            return Task((reject, resolve) => this.fork(a => reject(a), b => resolve(fn(b))))
        }
    }
})

// Monad
const chain = o => ({
    ...o, ...{
        chain(fn) {
            return Task((reject, resolve) => this.fork(reject, x => fn(x).fork(reject, resolve)))
        }
    }
})

// Applicative
const ap = o => ({
    ...o, ...{
        ap(f) {
            return this.chain(fn => f.map(fn))
        }
    }
})

const Task = computation => compose(ap, chain, map, fork)(computation)

Task.of = x => Task((_, resolve) => resolve(x))
Task.rejected = a => Task((reject, _) => reject(a))

// Either
const Right = x =>
    ({
        ap: b2 => b2.map(x),
        chain: f => f(x),
        chainLeft: f => Right(x),
        map: f => Right(f(x)),
        mapLeft: f => Right(x),
        fold: (f, g) => g(x),
    })

const Left = x =>
    ({
        ap: b2 => Left(x),
        chain: f => Left(x),
        chainLeft: f => f(x),
        map: f => Left(x),
        mapLeft: f => Left(f(x)),
        fold: (f, g) => f(x),
    })


const of = x => Right(x)

const tryCatch = f => x => {
    try {
        return Right(f(x))
    } catch (e) {
        return Left(e)
    }
}


const Either = {
    Right,
    Left,
    of,
    tryCatch,
}

// Helper
const log = label => value => (console.log(`${label}: ${JSON.stringify(value, null, 2)}`), value)

const curry = (fn) => {
    return function f1(...args) {
        return args.length >= fn.length
            ? fn(...args)
            : (...moreArgs) => f1(...[...args, ...moreArgs])
    }
}

const map = f => x => Array.isArray(x) 
  || typeof(x) === "object" 
  && x !== null 
  && !Object.keys(x).join(",").includes("map")
    ? f(x) 
    : x.map(f)

const mapLeft = f => e => e.mapLeft(f)

const fold = (f, g) => e => e.fold(f, g)

const chain = f => e => e.chain(f)

const chainLeft = f => e => e.chainLeft(f)

const ap = b2 => e => e.ap(b2)

const fork = reject => resolve => b => b.fork(reject, resolve)

const asyncPipe = fns => x => fns.reduce(async (v, f) => f(await v), x)

const pipe = fns => x => fns.reduce((v, f) => f(v), x)

export { Either, Task, log, cury, map, mapLeft, fold, chain, chainLeft, ap, fork, asyncPipe, pipe }
