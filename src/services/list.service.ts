import ListRepository from "../repositories/list.repository";
import List from "../models/list.model";
import { CreateListDto, ListFilters, UpdateListDto } from "../types/list";
import { PaginationParams } from "../types/pagination";
import { PaginatedResult } from "../types/pagination";
import ToDoList from "../models/list.model";

class ListService {
  private listRepository: ListRepository;

  constructor(listRepository: ListRepository) {
    this.listRepository = listRepository;
  }

  async getAllTodos(
    userId: number,
    pagination?: PaginationParams,
    filters?: ListFilters
  ): Promise<PaginatedResult<ToDoList> | string> {
    const data = await this.listRepository.findAll(userId, pagination, filters);

    if (typeof data === "string") {
      return data;
    }

    const { todos, total } = data;

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const lastPage = Math.ceil(total / limit);

    return {
      data: todos,
      meta: {
        total,
        page,
        lastPage,
        hasNextPage: page < lastPage,
        hasPrevPage: page > 1,
      },
    };
  }

  async getTodoById(id: number, userId: number): Promise<ToDoList | string> {
    const todo = await this.listRepository.findById(id, userId);

    if (typeof todo === "string") {
      return todo;
    }

    if (!todo) {
      return "Todo not found";
    }

    return todo;
  }

  async createTodo(todoData: CreateListDto): Promise<ToDoList | string> {
    if (!todoData.title || !todoData.content) {
      return "Title and content are required";
    }

    const result = await this.listRepository.create(todoData);

    if (typeof result === "string") {
      return result;
    }

    return result;
  }

  async updateTodo(
    userId: number,
    id: number,
    todoData: UpdateListDto
  ): Promise<ToDoList | string> {
    const existingTodo = await this.listRepository.findById(id, userId);

    if (typeof existingTodo === "string") {
      return existingTodo;
    }

    if (!existingTodo) {
      return "Todo not found";
    }

    const result = await this.listRepository.update(id, todoData);

    if (typeof result === "string") {
      return result;
    }

    return result;
  }

  async markTodoAsCompleted(
    id: number,
    userId: number
  ): Promise<ToDoList | string> {
    const existingTodo = await this.listRepository.findById(id, userId);

    if (typeof existingTodo === "string") {
      return existingTodo;
    }

    if (!existingTodo) {
      return "Todo not found";
    }

    const result = await this.listRepository.markAsCompleted(id);

    if (typeof result === "string") {
      return result;
    }

    return result;
  }

  async softDeleteTodo(id: number, userId: number): Promise<ToDoList | string> {
    const existingTodo = await this.listRepository.findById(id, userId);

    if (typeof existingTodo === "string") {
      return existingTodo;
    }

    if (!existingTodo) {
      return "Todo not found";
    }

    const result = await this.listRepository.softDelete(id);

    if (typeof result === "string") {
      return result;
    }

    return result;
  }
}

export default ListService;
