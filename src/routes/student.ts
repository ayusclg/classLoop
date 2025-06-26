import express from 'express'
import { addMyDetails, addOrUpdateProfile, deleteAccount, getMyDetails, getStudentById, logout, studentCreate, studentLogin } from '../controllers/student'
import { verifyUser } from '../middlewares/auth'
import { Upload } from '../middlewares/fileUpload'


const router = express.Router()

router.post("/stdCreate", studentCreate)
router.post("/stdLogin", studentLogin)
router.get("/stdGet", verifyUser, getMyDetails)
router.get("/getOther/:id", verifyUser, getStudentById)
router.post("/logout",verifyUser,logout)
router.delete("/delete",verifyUser,deleteAccount)
router.post("/profile", Upload.single("profilePicture"), verifyUser, addOrUpdateProfile)
router.put("/details",verifyUser,addMyDetails)
export default router