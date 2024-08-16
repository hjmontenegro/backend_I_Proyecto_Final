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

router.get('/api/products', async (req, res) => {
    try {

        const products = await productsModel.find({});
        let limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const sort = req.query.sort;
        const query = req.query.query;

        let productsLimit = products;

        if (isNaN(limit)) {
            limit = 10;
        } 

        if (limit <= 0) {
            res.status(500).json({ msg: "Error: Limit no puede ser un numero negativo." });
        }
        
        productsLimit = products.slice(0, limit);



        res.status(200).json({
            msg: `Mostrando los productos: Limit ${limit}`, productsLimit
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error: Al obtener los productos." });
    }
});

router.get('/api/products/:pid', async (req, res) => {
    try {
        const idProducto = req.params.pid;
        const productBuscado = await productsModel.findOne({ id: idProducto });

        if (productBuscado) {
            res.status(200).json({
                msg: `MFiltro de  producto con id ${idProducto}`,
                productBuscado,
              });
        } else {
            res.status(404).json({ error: 'Producto no filtrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error: Al filtrar el producto por numero de Id." });
    }
});

// Ruta para agregar un nuevo producto
router.post('/api/products', async (req, res) => {
    try {
        let { title, description, code, price, stock, category, thumbnail } = req.body;

        if (ValidarProductos(req.body))
        {
            return res.status(400).json({
                msg: "Falta algún campo obligatorio o alguno de los campos tiene el tipo de dato incorrecto.",
            });        
        }

        price = parseFloat(price);
        stock = parseInt(stock);

        let status = stock > 0;
        
        //thumbnail = req.body.thumbnail;

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

router.put('/api/products/:pid', async (req, res) => {

    try {
        const idProducto = req.params.pid;
        let { title, description, code, price, stock, category, thumbnail } = req.body;

        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
            ...(code && { code: parseInt(code) }),
            ...(price && { price: parseFloat(price) }),
            ...(stock !== undefined && { stock: parseInt(stock) }),
            status: stock > 0,
            ...(category && { category }),
            ...(thumbnail && { thumbnail }),
        };
      
        const updatedProduct = await productsModel.findOneAndUpdate(
            { id: idProducto },
            updateData,
            { new: true }
        );

        if (updatedProduct) {
            socketServer.emit("Product Update", updatedProduct);
            res.status(200).json({
              msg: `Producto modificado correctamente con el id ${idProducto}`,
              productoModificado: updatedProduct,
            });
        } else {
            res.status(404).json({ msg: `No se encuentra el producto con id ${idProducto}` });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error: Al modificar el producto." });
    }
});

router.delete('/api/products/:pid', async (req, res) => {
    try {
        
        const idProducto = parseInt(req.params.pid);
        const deletedProduct = await productsModel.findOneAndDelete({ id: idProducto });

        if (deletedProduct) {
            socketServer.emit("Product Deleted", deletedProduct);
            res.status(200).json({
              msg: `Se eliminó el producto con id ${idProducto}`,
              productoAEliminar: deletedProduct,
            });
          } else {
            res.status(404).json({ msg: "No se encuentra el producto con dicho id" });
          }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: `Error: Al eliminar el producto con id ${idProducto}.` });
      }
});

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