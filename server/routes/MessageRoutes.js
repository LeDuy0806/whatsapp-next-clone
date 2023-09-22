import { Router } from 'express';
import {
    addMessage,
    getMessages,
    addImageMessage,
    getInitialContactWithMessages,
} from '../controllers/MessageController.js';
import multer from 'multer';

const route = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `./uploads/images`;
        return cb(null, dir);
    },
});

const uploadImage = multer({
    dest: 'uploads/images',
});

route.post('/add-message', addMessage);
route.get('/get-messages/:from/:to', getMessages);
route.post('/add-image-message', uploadImage.single('image'), addImageMessage);
route.get('/get-initial-contacts/:from', getInitialContactWithMessages);

export default route;
