import express, { Request, Response, Router } from 'express'
import { json, urlencoded } from 'body-parser'

const CHAR_CODE_AT = 65
const router = Router()
const app = express()

app.use(urlencoded({ extended: true }))
app.use(json({ limit: "100mb" }))


router.get("/get/dominio/per/id/:id", (request: Request, response: Response) => {
    const num = Number(request.params.id)

    let dig1 = Math.trunc(num / Math.pow(26e3, 3))
    let dig2 = Math.trunc((num - (dig1 * Math.pow(26e3, 3))) / Math.pow(26e3, 2))
    let dig3 = Math.trunc((num - ((dig1 * Math.pow(26e3, 3)) + (dig2 * Math.pow(26e3, 2)))) / Math.pow(26e3, 1))
    let dig4 = Math.trunc((num - ((dig1 * Math.pow(26e3, 3)) + (dig2 * Math.pow(26e3, 2)) + (dig3 * Math.pow(26e3, 1)))) / 1000)
    let dig5 = Number(num.toString().substring(num.toString().length - 3, num.toString().length)) - 1
    
    response.json({
        dominio: String.fromCharCode(dig1 + 65) +
            String.fromCharCode(dig2 + 65) +
            String.fromCharCode(dig3 + 65) +
            String.fromCharCode(dig4 + 65) +
            dig5.toString()
    });
})

router.get("/get/id/per/dominio/:dominio", (request: Request, response: Response) => {
    const { dominio } = request.params

    // A ASCII = 65; A Dominio = 0 
    // A = 26e3 ^ 3, A = 26e2 ^ 2, 
    const letters = dominio.toUpperCase().substr(0, 4).split("").map(letter => (letter.charCodeAt(0) - CHAR_CODE_AT))
    const number = Number(dominio.substr(4))

    let lettersSum = 0
    lettersSum += letters[0] * Math.pow(26e3, 3)
    lettersSum += letters[1] * Math.pow(26e3, 2)
    lettersSum += letters[2] * Math.pow(26e3, 1)
    lettersSum += letters[3] * 1e3

    let sum = lettersSum + number + 1

    return response.json({ id: sum })
})

app.use("/patent", router)

app.listen(5000, () => {
    console.log("servidor corriendo")
})