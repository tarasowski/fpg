(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fpg = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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


module.exports = Either

},{}],2:[function(require,module,exports){
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


},{"./either":1,"./task":3}],3:[function(require,module,exports){
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

module.exports = Task

},{}]},{},[2])(2)
});
