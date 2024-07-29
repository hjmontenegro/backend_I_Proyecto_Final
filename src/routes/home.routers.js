import express from 'express'
import fs from 'fs'

const router = express.Router()

//Ruta que no deberia estar aca
router.get('/' , (req, res) => {

    fs.readFile('src/data/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const products = JSON.parse(data);

        res.render('home', {
            products
        })

    });
})

export default router