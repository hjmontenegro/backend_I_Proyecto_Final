import express from 'express'
import productsModel from "../models/products.model.js";

import { getNextId } from "../utils/utils.js";

import { socketServer } from "../app.js";

const router = express.Router()

const products = [];


router.use(async (req, res, next) => {
    try {
      const loadedProducts = await productsModel.find({});
      req.products = loadedProducts;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Error: Al cargar los productos." });
    }
  });

/*router.get('/api/products', (req, res) => {

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
});*/

/*router.get('/api/products/:pid', (req, res) => {

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
});*/

// Ruta para agregar un nuevo producto

router.post('/api/products', async (req, res) => {
    try {
        let { title, description, code, price, stock, category } = req.body;

        if (ValidarProductos(req.body))
        {
            return res.status(400).json({
                msg: "Falta algún campo obligatorio o alguno de los campos tiene el tipo de dato incorrecto.",
            });        
        }

        price = parseFloat(price);
        stock = parseInt(stock);

        let status = stock > 0;
        
        const thumbnail = "";

        const newProduct = new productsModel({
            id: await getNextId(productsModel),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        });
    
        await newProduct.save();

        socketServer.emit("Product Add", newProduct);
        res.status(201).json({
            msg: `Producto agregado exitosamente con id ${newProduct.id}`,
            newProduct
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error: Al guardar el producto.", error });
  }

    
});

/*router.put('/api/products/:pid', (req, res) => {

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
});*/

/*router.delete('/api/products/:pid', (req, res) => {

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
});*/

function ValidarProductos (product) {

    if (
        (product.title !== undefined && typeof product.title !== "string") ||
        (product.description !== undefined && typeof product.description !== "string") ||
        (product.code !== undefined && (typeof product.code !== "string")) ||
        (product.price !== undefined && (typeof product.price !== "number" || product.price < 1)) ||
        (product.stock !== undefined && (typeof product.stock !== "number" || product.stock < 0)) ||
        (product.category !== undefined && typeof product.category !== "string")
      ){
        return false;
    }
    
    return true;
}
export default router