// Higher Order Function take argument of 2nd function

// This is a Promise with 3 perametres req,res,next.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }