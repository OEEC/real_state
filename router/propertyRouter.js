import express from "express";
import { admin } from "../controllers/propertyController.js";

const router = express.Router();

router.get('/myProperties', admin);

export default router