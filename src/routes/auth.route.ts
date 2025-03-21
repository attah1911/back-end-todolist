import { Router } from 'express';
import dummyController from '../controllers/dummy.controller'

const router = Router();


router.get('/dummy', dummyController.dummy)


export default router;
