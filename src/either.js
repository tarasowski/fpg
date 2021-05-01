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
