import { Router } from "express";
import userRoutes from "./user.routes";

const apiV1Router: Router = Router();

apiV1Router.use(userRoutes);

const apiRouter: Router = Router();
apiRouter.use("/v1", apiV1Router);

export default apiRouter;
