import express from 'express'

//import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js"; 

const router = express.Router()

//Ruta que no deberia estar aca
router.get('/' , async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 10 ? 10 : limit;
        const sort = req.query.sort;
        const category = req.query.category;
    
        let filter = {};
        if (category) {
            filter.category = category;
        }
    
        let sortOrder;
        let result;
        if (sort) {
            sortOrder = sort === "desc" ? -1 : 1;
            result = await productsModel.paginate(filter, {
                page,
                limit,
                sort: { price: sortOrder },
            });
        } else {
            result = await productsModel.paginate(filter, {
                page,
                limit,
            });
        }
    
        // Obtener todas las categorías para el filtro
        const allCategories = await productsModel.distinct("category");
    
        result.sort = sort;
        result.category = category;
        result.categories = allCategories;
        result.prevLink = result.hasPrevPage
          ? `/?page=${result.prevPage}${limit < 10 ? `&limit=${limit}` : ""}${
              sort ? `&sort=${sort}` : ""
            }${category ? `&category=${category}` : ""}`
          : "";
        result.nextLink = result.hasNextPage
          ? `/?page=${result.nextPage}${limit < 10 ? `&limit=${limit}` : ""}${
              sort ? `&sort=${sort}` : ""
            }${category ? `&category=${category}` : ""}`
          : "";
        result.isValid = !(page <= 0 || page > result.totalPages);
    
        res.render("home", result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al cargar los productos." });
    }
});

router.get('/realtimeproducts' , async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 10 ? 10 : limit;
        const sort = req.query.sort;
        const category = req.query.category;
    
        let filter = {};
        if (category) {
            filter.category = category;
        }
    
        let sortOrder;
        let result;
        if (sort) {
            sortOrder = sort === "desc" ? -1 : 1;
            result = await productsModel.paginate(filter, {
                page,
                limit,
                sort: { price: sortOrder },
            });
        } else {
            result = await productsModel.paginate(filter, {
                page,
                limit,
            });
        }
    
        // Obtener todas las categorías para el filtro
        const allCategories = await productsModel.distinct("category");
    
        result.sort = sort;
        result.category = category;
        result.categories = allCategories;
        result.prevLink = result.hasPrevPage
          ? `/realtimeproducts?page=${result.prevPage}${limit < 10 ? `&limit=${limit}` : ""}${
              sort ? `&sort=${sort}` : ""
            }${category ? `&category=${category}` : ""}`
          : "";
        result.nextLink = result.hasNextPage
          ? `/realtimeproducts?page=${result.nextPage}${limit < 10 ? `&limit=${limit}` : ""}${
              sort ? `&sort=${sort}` : ""
            }${category ? `&category=${category}` : ""}`
          : "";
        result.isValid = !(page <= 0 || page > result.totalPages);
    
        res.render("home", result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al cargar los productos." });
    }
})

export default router