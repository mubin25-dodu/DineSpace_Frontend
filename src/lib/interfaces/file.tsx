export interface User {
    id: string;
    files?: Files[];
}

export interface Resturant {
    id: string;
    files?: Files[];
}

export interface menu {
    id: string;
    images?: Files[];
}

export interface Files {
    id: string;
    FileName: string;
    OriginalName: string;
    Path: string;
    Size: number;
    CreatedAt: Date;
    UploadedByUserId: string;
    uploadedByUser: User;
    RestaurantId?: string | null;
    restaurant?: Resturant | null;
    MenuId?: string | null;
    Menu?: menu | null;
}
