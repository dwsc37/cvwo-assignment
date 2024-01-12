//AUTH interfaces
export interface Credentials {
    username: string,
    password: string,
}

export interface Message {
    message: string
}

//POST interfaces 
export interface Post {
    ID: number,
    Title: number,
    Body: number,
}
//MODULE interfaces
export interface Module {
    ID: number,
    Code: string,
    Name: string,
}

export interface ModuleDetailed extends Module {
    UserCount: number,
    IsSubscribed: boolean,
}


export interface ModuleResponse {
    module: Module | ModuleDetailed
}

export interface ModuleListResponse {
    modules: Module[] | ModuleDetailed []
}