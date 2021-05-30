const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.get("/files/details/:data", controller.getListFiles);
  router.get("/files/fetch/:data", controller.sendAudioFileReq);
  router.get("/files/get/:data", controller.sendAudioFile);
  router.get("/files/recommendation/:data", controller.getRecommendation);
  router.get("/files/test/:data", controller.test);
  router.get("/files/update/", controller.update);
  router.get("/files/", controller.msg);
  app.use(router);
};

module.exports = routes;
