import { Router } from "express";
import ListController from "../controllers/list.controller";
import ListService from "../services/list.service";
import ListRepository from "../repositories/list.repository";
import { PrismaClient } from "@prisma/client";


const router = Router()

const prismaClient = new PrismaClient();
const listRepository = new ListRepository(prismaClient);
const listService = new ListService (listRepository);
const listController = new ListController (listService);

router.get("/", (req, res, next) => listController.getAllTodos(req, res, next));
router.get("/:id", (req, res, next) => listController.getTodoById(req, res, next));
router.post("/", (req, res, next) => listController.createTodo(req, res, next));
router.put("/:id", (req, res, next) => listController.updateTodo(req, res, next));
router.patch("/:id", (req, res, next) => listController.softDeleteTodo(req, res,next));
router.patch("/:id/complete", (req, res, next) => listController.markTodoAsCompleted(req, res, next));


export default router;
