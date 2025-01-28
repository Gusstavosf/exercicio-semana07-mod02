import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import express from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

AppDataSource.initialize().then(async () => {

    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
    
}).catch(error => console.log(error))
