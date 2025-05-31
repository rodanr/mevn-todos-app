import { Router } from 'express';
import authRoutes from './auth.routes';
import todoRoutes from './todo.routes';

const apiV1Router: Router = Router();

apiV1Router.use(authRoutes);
apiV1Router.use(todoRoutes);

const apiRouter: Router = Router();
apiRouter.use('/v1', apiV1Router);

export default apiRouter;
