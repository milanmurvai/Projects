export type User = {
    id: string;
    username: string;
    name: string;
    password: string;
    type: Type;
    projects: Project[];
};

export type UserResponse = {
    id: string;
    username: string;
    name: string;
    password: string;
    type: Type;
};

export type UserRequest = {
    name: string;
    type: Type;
}

export type LoginRequest = {
    username: string;
    password: string;
}

export enum Type { ADMIN = "ADMIN", ANGAJAT = "ANGAJAT" }

export enum Status {
    POTENTIAL = "POTENTIAL",
    OFERTAT = "OFERTAT",
    ACCEPTAT = "ACCEPTAT",
    MASURAT = "MASURAT",
    IN_LUCRU = "IN_LUCRU",
    FINALIZAT = "FINALIZAT",
    RENUNTAT = "RENUNTAT"
}


export type Client = {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
}

export type ClientRequest = {
    name: string;
    address: string;
    phone: string;
    email: string;
}

export type Activity = {
    id: number;
    user: User;
    project: Project;
    startDate: string;
    endDate: string;
    hours: number;
    details: string;
}

export type ActivityRequest = {
    userId: number;
    projectId: number;
    startDate: string;
    endDate: string;
    hours: number;
    details: string;
}


export type ActivityResponse = {
    id: number;
    userId: number;
    projectId: number;
    startDate: string;
    endDate: string;
    hours: number;
    details: string;
}

export type Material = {
    id: number,
    name: string;
    coefficient: number;
}

export type MaterialRequest = {
    name: string;
    coefficient: number;
}

export type Project = {
    id: number;
    name: string;
    description: string;
    client: Client;
    address: string;
    materials: ProjectMaterial[];
    hours: number;
    price: number;
    advance: number;
    invoice: boolean
    status: Status;
    startDate: string;
    limitDate: string;
    user: User[];
    totalAmount: number;
}

export type ProjectRequest = {
    name: string;
    description: string;
    clientId: number;
    address: string;
    materials: ProjectMaterialRequest[];
    price: number;
    advance: number;
    invoice: boolean
    status: Status;
    startDate: string;
    limitDate: string;
}

export type ProjectResponse = {
    id: number;
    name: string;
    description: string;
    clientId: number;
    address: string;
    materials: ProjectMaterialResponse[];
    hours: number;
    price: number;
    advance: number;
    invoice: boolean
    status: Status;
    startDate: string;
    limitDate: string;
    users: UserResponse[];
    total: number;
}

export type ProjectMaterial = {
    id: number,
    project: Project,
    material: Material,
    quantity: number
    total: number
}

export type ProjectMaterialResponse = {
    id: number,
    projectId: number,
    materialId: number,
    quantity: number
    total: number
}

export type ProjectMaterialRequest = {
    materialId: number,
    quantity: number
}

export type Employee = {
    id: number;
    name: string;
    coefficient: number;
    costCoefficient: number;
}

export type EmployeeRequest = {
    name: string;
    coefficient: number;
    costCoefficient: number;
}
