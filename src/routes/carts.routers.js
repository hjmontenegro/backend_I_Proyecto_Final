import express from 'express'
import fs from 'fs'

const router = express.Router();
//const fs = require('fs');

router.post('/api/carts', (req, res) => {

    // Lee el archivo "carts.json"
    fs.readFile('src/data/carts.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const carts = (data === "")? [] : JSON.parse(data);
        const id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

        const newCarts = { id, products : [] }
        carts.push(newCarts);

        // Escribe los productos actualizados en el archivo "productos.json"
        fs.writeFile('src/data/carts.json', JSON.stringify(carts, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json(newCarts);
        });
    });
});

router.get('/api/carts/:cid', (req, res) => {

    // Lee el archivo "carts.json"
    fs.readFile('src/data/carts.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const carts = (data === "")? [] : JSON.parse(data);
        const carts_id = req.params.cid;

        const cart = carts.find(cart => cart.id === parseInt(carts_id));

        // Escribe los productos actualizados en el archivo "productos.json"
        fs.writeFile('src/data/carts.json', JSON.stringify(carts, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json(cart);
        });
    });
});

router.post('/api/carts/:cid/product/:pid', (req, res) => {
    
    
    // Lee el archivo "carts.json"
    fs.readFile('src/data/carts.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        let products = [];
        

        const carts = JSON.parse(data);
        //const products = BuscarProductos();
        const carts_id = req.params.cid;
        const producto_id = req.params.pid;

        //console.log(carts_id)
        //console.log(producto_id)

        //console.log(products)

        const cart = carts.find(cart => cart.id === parseInt(carts_id));
        //const product = products.find(product => product.id === parseInt(producto_id));

        //console.log(cart)
        //console.log(product)

        //const newCarts = { id, products { title, description };

        console.log(products)

        if (cart) { //&& product) {
            const Cartproduct = cart.products.find(product => product.producto_id === producto_id);

            console.log(Cartproduct)

            if(Cartproduct) {
                Cartproduct.quantity += 1;
            } else {
                const newProduct = {producto_id, quantity:1}
                cart.products.push(newProduct);

                //res.json(cart.products);
            }

            // Escribe los productos actualizados en el archivo "carts.json"
            fs.writeFile('src/data/carts.json', JSON.stringify(carts, null, 2), err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.json(cart);
            });

        } else {
            res.status(404).json({ error: 'Cart no encontrado' });
        }
    });
});

function BuscarProductos () {
    // Lee el archivo "products.json"
    fs.readFile('src/data/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return JSON.parse(data);
    });

}

export default router