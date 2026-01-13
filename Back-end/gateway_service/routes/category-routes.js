const express = require('express')
const { getCategories, createCategory, getCategorie } = require('../controller/category-controllers')
const { validateGet, validateCreate } = require('../middlewares/category-middlewares/validator')
const router = express.Router()

router.get('/get-categories', validateGet ,getCategories)
router.get('/get-one-categorie', getCategorie)
router.post('/create-category', validateCreate ,createCategory)

module.exports = router