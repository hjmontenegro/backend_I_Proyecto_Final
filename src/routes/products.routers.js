import express from 'express'
import fs from 'fs'

const router = express.Router()
//const fs = require('fs');

const products = [];

router.get('/api/products', (req, res) => {

    // Lee el archivo "productos.json"
    fs.readFile('src/data/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const products = JSON.parse(data);
        const limit = req.query.limit;

        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    });
});

router.get('/api/products/:pid', (req, res) => {

    // Lee el archivo "productos.json"
    fs.readFile('src/data/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const products = JSON.parse(data);
        const id = req.params.pid;
        const product = products.find(product => product.id === parseInt(id));

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    });
});

// Ruta para agregar un nuevo producto

router.post('/api/products', (req, res) => {

    const { title, description, code, price, status, stock, category } = req.body;

    // Lee el archivo "productos.json"
    fs.readFile('src/data/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const products = JSON.parse(data);
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        if (req.body.status) req.body.status = true;
        const newProduct = { id, title, description, code, price, status: status || true, stock, category };

        products.push(newProduct);

        // Escribe los productos actualizados en el archivo "productos.json"
        fs.writeFile('src/data/products.json', JSON.stringify(products, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json(newProduct);
        });
    });
});

router.put('/api/products/:pid', (req, res) => {

    // Lee el archivo "productos.json"
    fs.readFile('src/data/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const products = JSON.parse(data);
        const id = parseInt(req.params.pid);
        //const newProduct = { id, title, description, code, price, status, stock, category };

        

        if (ValidarProductos(req.body))
        {
            res.status(404).json({ message: "Todos los datos son oblgatorios" });

        }
        else
        {
            const product = products.find((prod) => prod.id === id);
            if (product) {
                
                product.title = req.body.title
                product.description = req.body.description
                product.code = req.body.code
                product.price = req.body.price
                product.status = req.body.status;
                product.stock = req.body.stock
                product.category = req.body.category

                //res.json(req.body.status)
            } else {
                res.status(404).json({ message: "Tarea no encontrada" })
            }

            res.json(product);
        }
        fs.writeFile('src/data/products.json', JSON.stringify(products, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    });
});

router.delete('/api/products/:pid', (req, res) => {

    console.log(req.body.title)

    // Lee el archivo "productos.json"
    fs.readFile('src/data/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        const products = JSON.parse(data);
        const id = parseInt(req.params.pid);

        const product = products.filter((prod) => prod.id !==  id)

        fs.writeFile('src/data/products.json', JSON.stringify(product, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({ message: `Tarea con id ${id} eliminada correctamente` })
        });
    });
});

function ValidarProductos (product) {

    if (product.title && product.description && product.code && product.price && product.stock && product.category ) {
        return false;
    }
    
    return true;
}
export default router