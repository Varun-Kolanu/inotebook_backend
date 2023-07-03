import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()
const jwt_secret = process.env.JWT_SECRET

const fetchUser = (req, res, next) => {
    const jwtToken = req.header("auth-token")
    if(!jwtToken) {
        return res.status(401).json({
            error: "Please login using a valid token"
        })
    }
    try {
        const data = jwt.verify(jwtToken, jwt_secret)
        req.data = data
        next()
    } catch (error) {
        return res.status(401).json({
            error: "Please login using a valid token"
        })
    }
}

export default fetchUser