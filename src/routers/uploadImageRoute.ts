import { Router } from 'express'
import { uploadImageController } from '../controllers'

const router = Router()

router.post('/uploadImage', uploadImageController)

module.exports = router
