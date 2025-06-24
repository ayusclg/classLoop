import  express  from "express"
import { DbConnect } from "./database"
import dotenv from 'dotenv'

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


