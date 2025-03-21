import { Router } from "express";
import ListController from "../controllers/list.controller";
import ListService from "../services/list.service";
import ListRepository from "../repositories/list.repository";
import { PrismaClient } from "@prisma/client";

const router = Router()


export default router;
