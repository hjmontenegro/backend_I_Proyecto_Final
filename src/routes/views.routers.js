import express from 'express'

const router = express.Router()

let food = [
    {name:"Hambuerguesa", price: "1000"},
    {name:"Pizza", price: "2000"},
    {name:"Lomo", price: "3000"}
]

//Ruta que no deberia estar aca
router.get('/' , (req, res) => {
    let testUser = {
        name: "Javier",
        last_name: "Montenegro",
        role: "admin"//"user"
    }

    res.render('index', {
        user: testUser,
        isAdmin: testUser.role === "admin",
        food
    })
})

export default router