import express from 'express'
import { deleteAccount, getMyDetails, getStudentById, logout, studentCreate, studentLogin } from '../controllers/student'
import { verifyUser } from '../middlewares/auth'


const router = express.Router()

router.post("/stdCreate", studentCreate)
router.post("/stdLogin", studentLogin)
router.get("/stdGet", verifyUser, getMyDetails)
router.get("/getOther/:id", verifyUser, getStudentById)
router.post("/logout",verifyUser,logout)
router.delete("/delete",verifyUser,deleteAccount)

export default router