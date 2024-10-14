import express from "express";
import homeController from "../controllers/homeController";
import userController from '../controllers/userController'
let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.render('homepage.ejs')
    });

    router.get("/home", homeController.getHomePage);

    router.post("/api/login", userController.handleLogin);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    return app.use("/", router);

}
module.exports = initWebRoutes;