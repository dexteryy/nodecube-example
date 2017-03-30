
import { Router } from 'express';
import {
  authorized,
  unauthorized,
  authAPI,
} from './auth';
import githubAPI from './github';

const api = Router();

api.use(authorized);
api.use(unauthorized);
api.use(authAPI);
api.use('/github', githubAPI);

export default api;
