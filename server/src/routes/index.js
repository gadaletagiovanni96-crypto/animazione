import { Router } from 'express'; import { authenticate } from '../middleware/auth.js';
import auth from './auth.routes.js'; import users from './user.routes.js'; import materials from './material.routes.js';
import events from './event.routes.js'; import periods from './period.routes.js'; import notifications from './notification.routes.js';
const api = Router();
api.use(auth);            // rotte pubbliche
api.use(authenticate);    // da qui in poi serve il token
api.use('/users', users); api.use('/materials', materials); api.use('/events', events);
api.use('/periods', periods); api.use('/notifications', notifications);
export default api;
