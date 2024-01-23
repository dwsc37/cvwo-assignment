//AUTH interfaces

export interface Credentials {
    Username: string;
    Password: string;
}

export interface Message {
    message: string;
}

//TAG interfaces
export interface Tag {
    ID: number;
    Name: string;
}

//POST interfaces
export interface Post {
    Title: string;
    Body: string;
    Tags: Tag[];
    ModuleCode: string;
}

export interface PostUpdate extends Post {
    ID: number;
}
export interface PostDetailed extends PostUpdate {
    LikeCount: number;
    CommentCount: number;
    IsLiked: boolean;
    CreatedAt: Date;
    Username: string;
}

//COMMENT interfaces
export interface CommentDetailed {
    ID: number;
    CreatedAt: Date;
    Body: string;
    PostID: number;
    Username: string;
    LikeCount: number;
    IsLiked: boolean;
}

//MODULE interfaces
export interface Module {
    ID: number;
    Code: string;
    Name: string;
}

export interface ModuleDetailed extends Module {
    UserCount: number;
    IsSubscribed: boolean;
}

//USER interfaces
export interface UserInfo {
    Username: string;
    CreatedAt: Date;
    NumPosts: number;
    NumComments: number;
    NumSubscriptions: number;
}
