export type List = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updateAt: Date;
    isCompleted: boolean;
}

export type CreateListDto = {
    title: string;
    content: string;
    email: string;
}

export type UpdateListDto = {
    title?: string;
    content?: string;
    isCompleted?: boolean;
}

export interface ListFilters {
    isCompleted?: boolean;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }
