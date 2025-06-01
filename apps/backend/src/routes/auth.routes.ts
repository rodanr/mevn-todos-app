import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.controller';
import { validateBody } from '../middlewares/validation.middleware';
import { registerUserSchema, loginSchema } from '@mevn-todos/shared';

const router: Router = Router();

router.post('/auth/register', validateBody(registerUserSchema), registerUser);
router.post('/auth/login', validateBody(loginSchema), login);

export default router;
