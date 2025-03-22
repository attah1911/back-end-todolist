import { Prisma, PrismaClient } from "@prisma/client";
import { CreateListDto, ListFilters, UpdateListDto} from "../types/list";
import { getErrorMessage } from "../utils/error";
import ToDoList from "../models/list.model";
import { PaginationParams } from "../types/pagination";


class ListRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
      this.prisma = prisma;
    }

    async findAll(
        userId: number,
        pagination?: PaginationParams,
        filters?: ListFilters

    ): Promise<{ todos: ToDoList[], total: number } | string> {
        try {
            const page = pagination?.page || 1;
            const limit = pagination?.limit || 10;
            const skip = (page - 1) * limit;

            const where: Prisma.ToDoListWhereInput = {
                isDeleted: false,
                userId,
                ...(filters?.search && {
                    title: { contains: filters.search, mode: 'insensitive' },
                }),
                ...(filters?.isCompleted !== undefined && {
                    isCompleted: filters.isCompleted,
                }),
            };

            const [todos, total] = await Promise.all([
                this.prisma.toDoList.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                this.prisma.toDoList.count({ where }),
            ]);

            return {
                todos: todos.map((todo) => ToDoList.fromEntity(todo)),
                total,
            };


        } catch (error) {
            return getErrorMessage(error);
        }
        
    }

    async findById(id: number, userId: number) : Promise<ToDoList | null | string>{
        try {
            const todo = await this.prisma.toDoList.findFirst({
            where: {
                id,
                userId,
                isDeleted: false
            } as Prisma.ToDoListWhereInput
        });

        return todo? ToDoList.fromEntity(todo) : null;
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    async create(todoData: CreateListDto): Promise<ToDoList | string>{
        try {
            const todo = await this.prisma.toDoList.create({
                data: {
                    title: todoData.title,
                    content: todoData.content,
                    user: {
                        connect: {
                            email: todoData.email
                        }
                    },
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as Prisma.ToDoListCreateInput
            });
            return ToDoList.fromEntity(todo);       
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    async update(id: number, todoData: UpdateListDto): Promise<ToDoList | string>{
        try {
            const todo = await this.prisma.toDoList.update({
                where: {id} as Prisma.ToDoListWhereUniqueInput,
                data: {
                    ...todoData,
                    updatedAt: new Date(),
                }
            });
    
            return ToDoList.fromEntity(todo);
    
        } catch (error) {
            return getErrorMessage(error);
        }
    }

    async markAsCompleted(id: number): Promise<ToDoList | string> {
        try {
            const todo = await this.prisma.toDoList.update({
                where: { id },
                data: {
                    isCompleted: true,
                    updatedAt: new Date(),
                },
            });
    
            return ToDoList.fromEntity(todo);
        } catch (error) {
            return getErrorMessage(error);
        }
    }
    

    async softDelete(id:number): Promise<ToDoList | string>{
        try {
            const todo = await this.prisma.toDoList.update({
                where: {id} as Prisma.ToDoListWhereUniqueInput,
                data: {
                    isDeleted: true,
                    updatedAt: new Date()
                } as Prisma.ToDoListUpdateInput
            });
    
            return ToDoList.fromEntity(todo);
        } catch (error) {
            return getErrorMessage(error);
        }
    }
}

export default ListRepository;