import  express  from "express"
import { DbConnect } from "./database"
import dotenv from 'dotenv'
import { Request,Response,NextFunction } from "express"

dotenv.config()
const app = express()
const port = process.env.PORT || 5000
const host = "127.0.0.1"


app.use(express.json())
app.use(express.urlencoded({extended:true}))


DbConnect().then((res) => {
   app.listen(port, () => {
    console.log(`you are running on : http://${host}:${port}`)
})
}).catch((err) => {
    console.log("Error In Database Connection ")
})


app.get("/", (req, res) => {
    res.send("Hello This Is Typescript Backend")
})


app.use((err: any, req: Request, res: Response, next: NextFunction)=> {
    res.status(err.statusCode || 500).json({
        message: err.message || "Server Error",
        stack: err.stack,
        data: null,
        ...err

    })
})