const { trace, compose, map, propEq, filter, curry, pipe, prop, reduce } = require('../index')
const test = require('tape')


test('should call a map function and multiply each element by x', assert => {
    const msg = 'returns a new array multiplied by 2'
    const testMap = x => x * 2
    const actual = map(testMap, [1, 2, 3, 4])
    const expected = [2, 4, 6, 8]
    assert.same(actual, expected, msg)
    assert.end()
})

test('should call a filter function and remove an element from an array', assert => {
    const msg = 'returns a new array w/o 2'
    const testFilter = x => x !== 2
    const actual = filter(testFilter, [1, 2, 3, 4])
    const expected = [1, 3, 4]
    assert.same(actual, expected, msg)
    assert.end()
})


test('should return only the value of the property', assert => {
    const msg = 'return Dimitri'
    const user = {
        name: 'Dimitri',
        location: 'Berlin',
        isAWSUser: true
    }
    const actual = prop('name')(user)
    const expected = 'Dimitri'
    assert.same(actual, expected, msg)
    assert.end()
})

test('should return true for a given value', assert => {
    const msg = 'returns an admin from the given array'
    const users = [
        { name: 'Dimitri', isAdmin: true },
        { name: 'John', isAdmin: false },
        { name: 'Mike', isAdmin: false },
    ]
    const isAdmin = propEq('isAdmin', true)

    const actual = filter(isAdmin, users)
    const expected = [{ name: 'Dimitri', isAdmin: true }]
    assert.same(actual, expected, msg)
    assert.end()
})

test('should return a sum from an array', assert => {
    const msg = 'returns 6'
    const testArray = [1, 2, 3]
    const sum = (acc, val) => acc + val
    const actual = reduce(sum, null, testArray)
    const expected = 6
    assert.same(actual, expected, msg)
    assert.end()
})

test('should construct a new object', assert => {
    const msg = 'returns an object with location prop'
    const user = [{ location: 'Berlin' }]
    const constructObj = (acc, val) => Object.assign(acc, val)
    const actual = reduce(constructObj, null, user)
    const expected = { location: 'Berlin' }
    assert.same(actual, expected, msg)
    assert.end()
})



// TODO:
// - test for compose
// - test for pipe
// - test for trace
// - test for curry
