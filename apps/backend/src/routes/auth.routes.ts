import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', login);

export default router;
