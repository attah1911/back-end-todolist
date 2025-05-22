import { NextFunction, Response } from "express";
import { responses } from "../constants";
import { AuthRequest } from "../middleware/auth";
import ListService from "../services/list.service";
import { ListFilters } from "../types/list";
import { PaginationParams } from "../types/pagination";

class ListController {
  private listService: ListService;

  constructor(listService: ListService) {
    this.listService = listService;
  }

  async getAllTodos(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const filters: ListFilters = {
        search: req.query.search as string,
        isCompleted: req.query.completed !== undefined ? req.query.completed === "true" : undefined,
      };

      const result = await this.listService.getAllTodos(req.user.id, pagination, filters);

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      res.status(200).json({
        success: true,
        message: responses.successGetToDoList,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTodoById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.listService.getTodoById(Number(req.params.id), req.user.id);

      if (typeof result === "string") {
        return res.status(404).json({
          success: false,
          message: result,
        });
      }

      res.status(200).json({
        success: true,
        message: responses.successGetToDoList,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTodo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(500).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.listService.createTodo({
        title: req.body.title,
        content: req.body.content,
        email: req.user.email,
      });

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      res.status(201).json({
        success: true,
        message: responses.successCreateToDoList,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.listService.updateTodo(
        req.user.id,
        Number(req.params.id),
        req.body
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      res.status(200).json({
        success: true,
        message: responses.successUpdateToDoList,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async softDeleteTodo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.listService.softDeleteTodo(
        Number(req.params.id),
        req.user.id
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      res.status(204).json({
        success: true,
        message: responses.successDeleteToDoList,
      });
    } catch (error) {
      next(error);
    }
  }

  async markTodoAsCompleted(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.listService.markTodoAsCompleted(
        Number(req.params.id),
        req.user.id
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      res.status(200).json({
        success: true,
        message: responses.successMarkCompleted,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ListController;
