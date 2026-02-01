const express = require('express')
const router = express.Router()
const { getOpenApiSpec, debugSpecs, getApiReference } = require('../controller/docs-controllers')

router.get('/openapi.json', getOpenApiSpec)
router.get('/debug-specs', debugSpecs)
router.get('/reference', getApiReference)

module.exports = router;