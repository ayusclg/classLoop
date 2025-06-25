import express from 'express'
import { studentCreate, studentLogin } from '../controllers/student'

const router = express.Router()

router.post("/stdCreate", studentCreate)
router.post("/stdLogin",studentLogin)

export default router