import {fileURLToPath} from 'url'
import {dirname} from 'path'
import path from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

//Crea una funcion para cambiar el formato de la fecha AAA/MM/DD => DD/MM/AAAA

export function cambiarFormato(){

}

//Crea una funcion para cambiar el formato de la moneda USD => ARS

export function cambiarFormatoMoneda(){
    
}


//getNextId para productos
import productsModel from "../models/products.model.js"; // Ajusta la ruta según la ubicación de tu modelo

export async function getNextId() {
  try {
    const lastProduct = await productsModel.findOne(
      {},
      {},
      { sort: { id: -1 } }
    );
    return lastProduct ? lastProduct.id + 1 : 1;
  } catch (error) {
    console.error("Error al obtener el siguiente ID:", error);
    throw error;
  }
}

import cartsModel from "../models/carts.model.js"; // Ajusta la ruta según la ubicación de tu modelo

//getNextId para carrito
export async function getNextIdC() {
  try {
    const lastCart = await cartsModel.findOne({}, {}, { sort: { id: -1 } });
    return lastCart ? lastCart.id + 1 : 1;
  } catch (error) {
    console.error("Error al obtener el siguiente ID:", error);
    throw error;
  }
}

//Helpers en handlebars
export const helpers = {
  eq: (a, b) => a == b,
  add: (a, b) => a + b,
};