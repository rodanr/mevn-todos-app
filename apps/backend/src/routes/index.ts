import { Router } from "express";
import authRoutes from "./auth.routes";

const apiV1Router: Router = Router();

apiV1Router.use(authRoutes);

const apiRouter: Router = Router();
apiRouter.use("/v1", apiV1Router);

export default apiRouter;
