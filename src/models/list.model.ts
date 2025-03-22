import { type ToDoList as PrismaList } from "@prisma/client";

class ToDoList {
    private id: number;
    private title: string;
    private content: string;
    private createdAt: Date;
    private isCompleted: Boolean;

    constructor(id:number, title: string, content: string, createdAt: Date, isCompleted: Boolean){
        this.id = id;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.isCompleted = isCompleted
    }

    static fromEntity(prismaList: PrismaList){
        return new ToDoList(
            prismaList.id,
            prismaList.title,
            prismaList.content,
            prismaList.createdAt,
            prismaList.isCompleted,
        )
    }

    toDTO(){
        return{
            id: this.id,
            title: this.title,
            content: this.content,
            createdAt: this.createdAt,
            isCompleted: this.isCompleted
        }
    }
}

export default ToDoList;
