const express = require('express')
const { getCategories, createCategory, getCategorie } = require('../controller/category-controllers')
const { validateGet, validateCreate } = require('../middlewares/category-middlewares/validator')
const router = express.Router()

/**
 * @openapi
 * /api/categories/get-categories:
 * get:
 * tags:
 * - Categories
 * summary: Get all categories
 * responses:
 * 200:
 * description: List of categories retrieved successfully.
 * 500:
 * description: Internal server error.
 */
router.get('/get-categories', validateGet, getCategories)

/**
 * @openapi
 * /api/categories/get-one-categorie:
 * get:
 * tags:
 * - Categories
 * summary: Get a specific category
 * responses:
 * 200:
 * description: Category found.
 * 404:
 * description: Category not found.
 */
router.get('/get-one-categorie', getCategorie)

/**
 * @openapi
 * /api/categories/create-category:
 * post:
 * tags:
 * - Categories
 * summary: Create a new category
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * example: "Food & Drinks"
 * icon:
 * type: string
 * example: "utensils"
 * responses:
 * 201:
 * description: Category created successfully.
 * 400:
 * description: Invalid input data.
 */
router.post('/create-category', validateCreate, createCategory)

module.exports = router