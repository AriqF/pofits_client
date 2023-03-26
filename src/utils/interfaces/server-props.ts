
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
    category: string;
    description: string;
    amount: string;
}

export interface IncomeCategory extends BaseServerData {
    id: number;
    title: string;
    description: string;
    isGlobal: boolean;
    income_type: "pasif" | "aktif";
    icon: string;
}

export interface ExpenseCategory extends BaseServerData {
    id: number;
    title: string;
    description: string;
    isGlobal: boolean;
    icon: string;
}

export interface BudgetData extends BaseServerData {
    id: number;
    amount: string;
    isRepeat: boolean;
    start_date: Date;
    end_date?: Date;
    category: JoinCategory
}

export interface AddBudgetData {
    amount: string;
    isRepeat: boolean;
    start_date: string;
    end_date?: string;
    category: {
        label: string, value: string, icon: string;
    }
    // end_month?: number;
    // end_year?: number;
}

interface JoinCategory {
    id: number;
    title: string;
    icon: string;
}