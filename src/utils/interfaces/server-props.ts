
export interface JWTServer {
    email: string;
    role: "user" | "admin";
    iat: number;
    exp: number;
    isKeepSignedIn?: boolean;
}

interface BaseServerData {
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
    created_by: CreatedBy;
}

export interface CreatedBy {
    id: number;
    username: string;
    email: string;
}

export interface WalletData extends BaseServerData {
    id: number;
    name: string;
    description: string;
    amount: string;
}

export interface IncomeCategory extends BaseServerData {
    id: number;
    title: string;
    description: string;
    isGlobal: boolean;
    income_type: "pasif" | "aktif";
}

export interface ExpenseCategory extends BaseServerData {
    id: number;
    title: string;
    description: string;
    isGlobal: boolean;
}