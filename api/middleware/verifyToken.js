import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: 'Non authentifié !' })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré" })
    }
}

export function verifyRole(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès refusé"})
        }
        next()
    }
}