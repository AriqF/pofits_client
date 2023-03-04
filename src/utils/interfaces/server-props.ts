

export interface JWTServer {
    email: string;
    role: "user" | "admin";
    iat: number;
    exp: number;
    isRefresh?: boolean;
}

export interface CreatedBy {
    id: number;
    username: string;
    email: string;
}

export interface WalletData {
    id: number;
    name: string;
    description: string;
    amount: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    created_by: CreatedBy;
}