import express from 'express'
import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

import { getNextIdC } from '../utils/utils.js';



const router = express.Router();

router.post('/', async (req, res) => {

    try {

        const newCarts = new cartsModel({
            id: await getNextIdC(),

        });
    
        await newCarts.save();

        res.send({ result: "success", payload: newCarts }); 


    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error: Al obtener Los Carritos." });
    }
});

router.get('/:cid', async (req, res) => {

    try {

        const idCart = req.params.cid;

        const cartBuscado = await cartsModel.findOne({ id: idCart }).populate('products.product');

        if (!cartBuscado) {
            return res.status(200).json({ products: [] });
        }

        res.json(cartBuscado.toObject());

        /*if (cartBuscado) {
            res.status(200).json({
                msg: `Filtro de Cart con id ${idCart}`,
                cartBuscado,
              });
        } else {
            res.status(404).json({ error: 'Producto no filtrado' });
        }*/

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error: Al Buscar Carrito por numero de Id." });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    
    try {  


        const idCart = req.params.cid;
        const idProducto = req.params.pid;

        const cartBuscado = await cartsModel.findOne({ id: idCart });
        const productBuscado = await productsModel.findOne({ id: idProducto });        

        if (cartBuscado) 
        { 
            if (productBuscado) 
            {
              
                const productCart = cartBuscado.products.find(p => p.product.toString() === productBuscado._id.toString());

                if (productCart) {
        
                    productCart.quantity += 1; 
        
                } else {
                    cartBuscado.products.push({ product: productBuscado._id, quantity: 1 });
                }
                
                productBuscado.stock -= 1;

                await cartBuscado.save();
                await productBuscado.save();

                res.status(200).json({
                    msg: `Se agrega el producto al Carrito`,
                    cartBuscado,
                });
            } else {
                res.status(404).json({ error: 'Producto a agregar no encontrado no encontrado' });
            }   
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error: Al Agregar un producto al Carrito." });
    }
});


router.delete('/:cid/product/:pid', async (req, res) => {
    
    try {  

        const idCart = req.params.cid;
        const idProducto = req.params.pid;

        const cartBuscado = await cartsModel.findOne({ id: idCart });
        const productBuscado = await productsModel.findOne({ id: idProducto });        

        if (cartBuscado) 
        { 
            if (productBuscado) 
            { 
                const productCart = cartBuscado.products.find(p => p.product.toString() === productBuscado._id.toString());

                if (productCart) {
                    
                    await cartsModel.findOne({ id: idCart }).updateMany({}, { $pull: { products: { product: productBuscado._id } } });
                    productBuscado.stock += productCart.quantity;

                    productBuscado.save();
                    res.status(200).json({
                        msg: `Se elimiena el producto del Carrito`,
                       // deletedProductCart
                    });
        
                } else {
                    res.status(404).json({ error: 'Producto a eliminar no encontrado' });
                }
        
                
                
            } else {
                res.status(404).json({ error: 'Producto a agregar inexistente' });
            }   
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error: Al Eliminar un producto al Carrito." });
    }
});

router.delete('/:cid', async (req, res) => {
    
    try {  

        const idCart = req.params.cid;

        const cartBuscado = await cartsModel.findOne({ id: idCart });

        if (cartBuscado) 
        { 
            await cartsModel.findOne({ id: idCart }).updateMany({}, { $set: { products: [] } });
                res.status(200).json({
                    msg: `Se elimiena todos los productos del Carrito`,
                    // deletedProductCart
                });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error: Al Eliminar un producto al Carrito." });
    }
});
export default router