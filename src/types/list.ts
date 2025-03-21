export type List = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updateAt: Date;
    isCompleted: Boolean;
}

export type CreateListDto = {
    title: string;
    content: string;
    email: string;
}

export type UpdateListDto = {
    title?: string;
    content?: string;
    isCompleted?: Boolean;
}

