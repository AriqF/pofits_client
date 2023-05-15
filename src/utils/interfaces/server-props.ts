
export interface User extends BaseServerData {
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    status: number,
    role: string,
    last_iat: number,
}

export interface UpdateProfileForm {
    firstname: string,
    lastname: string,
    email: string,
}

export interface ChangePasswordProfileForm {
    old_password: string,
    password: string,
    password_confirmation: string,
}

export interface JWTServer {
    email: string;
    role: "user" | "admin";
    iat: number;
    exp: number;
    isKeepSignedIn?: boolean;
}

interface BaseServerData {
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
    created_by?: CreatedBy;
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
    icon: string;
    description: string;
    amount: string;
}

export interface FormWalletData {
    id: number;
    name: string;
    category: {
        label: string, value: string, icon: string;
    }
    icon: string;
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

export interface FormIncomeCategory extends BaseServerData {
    id: number;
    title: string;
    icon: {
        value: string
    };
    description: string;
    income_type: {
        value: string, label: string,
    }
}

export interface ExpenseCategory extends BaseServerData {
    id: number;
    title: string;
    description: string;
    isGlobal: boolean;
    icon: string;
}

export interface FormExpenseCategory extends BaseServerData {
    id: number;
    title: string;
    description: string;
    isGlobal: boolean;
    icon: { value: string }
}

export interface BudgetData extends BaseServerData {
    id: number;
    amount: string;
    isRepeat: boolean;
    start_date: Date;
    end_date?: Date;
    category: JoinCategory
}

export interface ProBudgetData extends BudgetData {
    amountUsed: number;
    percentageUsed: number;
    amountRemaining: number;
}

export interface BudgetMonthRecap {
    borderBudget: number;
    percentageUsed: number;
    totalBudget: number;
    totalRemaining: number;
    totalUsed: number;
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

export interface IncomeEstimationData extends BaseServerData {
    id: number;
    amount: number;
    isRepeat: boolean;
    start_date: Date;
    end_date: Date;
    category: JoinCategory;
    amountAchieved: number;
    percentageAchieved: number;
    amountUnachieved: number;
    isAchieved: boolean;
}

export interface IncomeEstimationRecap {
    totalAchieved: number;
    totalUnachieved: number;
    totalTarget: number;
    percentageAchieved: number;
}

export interface IncomeEstmationForm {
    amount: string;
    isRepeat: boolean;
    start_date: string;
    end_date?: string;
    category: {
        label: string, value: string, icon: string;
    }
}

export interface Transactions extends BaseServerData {
    id: number;
    date: Date;
    title: string;
    amount: number;
    description?: string;
    category: JoinCategory;
    wallet?: JoinWallet;
}

export interface IncomeTransactions extends Transactions { }

export interface ExpenseTransactions extends Transactions { }

export interface BaseTransactionForm {
    category: {
        value: number;
        label: string;
        icon: string;
    };
    wallet?: {
        value: number;
        label: string;
        icon: string;
    };
    amount: string;
    date: string;
    title: string;
    description?: string
}

export interface IncomeForm extends BaseTransactionForm { }

export interface ExpenseForm extends BaseTransactionForm { }

export interface TransactionsMonthRecap {
    totalExpenses: number,
    totalIncomes: number,
    amountDiff: number,
    totalBudget?: number,
}

export interface AllTransactions {
    id: number;
    category: {
        id: number;
        title: string;
        icon: string;
    };
    wallet?: {
        id: number;
        name: string;
        amount: number;
    };
    title: string;
    description?: string;
    amount: number;
    type: "income" | "expense";
    date: Date;
    created_at: Date;
    created_by: {
        id: number;
        email: string;
    }
}

export interface FinanceGoal extends BaseServerData {
    id: number,
    title: string,
    isFlexible: boolean,
    amount_target: number,
    amount_reached: number,
    timebound: Date,
    frequencies: number,
    amount_per_frequency: number,
    isAchieved: boolean,
    priority: number,
    wallet: JoinWallet,
    percentage: number,
    estimated_achieved: Date,
    times_to_save_left: number,
    amounts_to_save_left: number,
    days_to_go: number,
    // description?: string,
}

export interface FinanceGoalForm {
    title: string,
    isFlexible: boolean,
    amount_target: string,
    timebound: Date,
    frequencies: {
        value: number;
        label: string;
    },
    amount_per_frequency: string,
    priority: {
        value: number;
        label: string;
    }
    wallet: {
        value: number;
        label: string;
        icon: string;
    }
}

export interface GoalSavingHistory extends BaseServerData {
    id: number,
    title: string,
    date: Date;
    amount: number,
}

export interface AddSavingForm {
    amount: string,
    date: string,
    title: string,
    wallet?: {
        icon: string,
        label: string,
        value: number,
    }
}

interface JoinWallet {
    id: number;
    name: string;
    amount?: string;
    icon?: string;
}

interface JoinCategory {
    id: number;
    title: string;
    icon: string;
}

export interface TransactionAllocation {
    cat_title: string,
    cat_icon: string,
    category: string,
    total_spent: number,
    percentage: number,
}

export interface AllocationChart {
    data: number[],
    labels: string[],
}

export interface AnnualChartDatasets {
    data: number[],
    backgroundColor: string,
    label: string,
}

export interface AnnualTransaction {
    total_amount: number,
    month: string,
}



