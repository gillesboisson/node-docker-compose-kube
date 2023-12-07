import { Application } from "express";

import configureUserRoutes from "./users/routes";

export function configureRoutes(app: Application):void{
    configureUserRoutes(app);
}