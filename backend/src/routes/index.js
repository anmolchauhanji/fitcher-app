import authroutes from "../routes/auth.routes.js"
import {Router} from "express"
const router = Router()

router.use("/auth",authroutes)

export default router