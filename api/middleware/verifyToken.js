export default function verfyToken(req, res, next) {
    try {
        // const authHeaders = req.headers.authorization
        // const token = authHeaders.split(' ')[1]
        const token = req.cookies.token
        console.log(token)
        if (!token) {
            return res.status(403).json({ message: 'Token manquant !' })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (err) {
        res.status(500).json({ message: err })
    }
}