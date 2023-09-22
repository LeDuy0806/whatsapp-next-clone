import { Router } from 'express';
import {
    checkUser,
    getAllUsers,
    onboardUser,
} from '../controllers/AuthController.js';

const route = Router();

route.post('/check-user', checkUser);
route.post('/onboard-user', onboardUser);
route.get('/get-contacts', getAllUsers);

export default route;
