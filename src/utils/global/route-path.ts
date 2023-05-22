
export enum AuthPath {
    LOGIN = "/auth/login/",
    REGISTER = "/auth/register/",
    FORGOT_PASS = "/auth/forgot-password/",
    RESET_PASS = "/auth/reset-password/"
}

export enum UserPath {
    HOME = "/me/",
    SETTINGS = "/me/settings/",
    PROFILE = "/me/settings/account",
    PROFILE_PRIVACY = "/me/settings/account/privacy",
    WALLETS = "/me/settings/wallets/",
    WALLETS_ADD = "/me/settings/wallets/add",
    WALLETS_EDIT = "/me/settings/wallets/",
    WALLETS_TRANSFER = "/me/settings/wallets/transfer-funds/",
    INCOME_CATEGORY = "/me/settings/income-category/",
    INCOME_CATEGORY_ADD = "/me/settings/income-category/add/",
    INCOME_CATEGORY_EDIT = "/me/settings/income-category/",
    EXPENSE_CATEGORY = "/me/settings/expense-category/",
    EXPENSE_CATEGORY_ADD = "/me/settings/expense-category/add/",
    EXPENSE_CATEGORY_EDIT = "/me/settings/expense-category/",
    BUDGET = "/me/budget/",
    BUDGET_EDIT = "/me/budget/edit/",
    BUDGET_ADD = "/me/budget/add/",
    BUDGET_HISTORY = "/me/budget/history/",
    ESTIMATION = "/me/income-target/",
    ESTIMATION_ADD = "/me/income-target/add",
    ESTIMATION_EDIT = "/me/income-target/edit/",
    FINANCE_GOAL = "/me/finance-goals/",
    FINANCE_GOAL_EDIT = "/me/finance-goals/edit/",
    FINANCE_GOAL_ADD = "/me/finance-goals/add/",
    FINANCE_GOAL_DETAIL = "/me/finance-goals/detail/",
    FINANCE_GOAL_ADD_SAVING = "/me/finance-goals/add-saving/",
    TRANSACTION = "/me/transaction/",
    TRANSACTION_INCOME_DETAIL = "/me/transaction/income/detail/",
    TRANSACTION_INCOME_ADD = "/me/transaction/income/add",
    TRANSACTION_INCOME_EDIT = "/me/transaction/income/edit/",
    TRANSACTION_EXPENSE_DETAIL = "/me/transaction/expense/detail/",
    TRANSACTION_EXPENSE_ADD = "/me/transaction/expense/add",
    TRANSACTION_EXPENSE_EDIT = "/me/transaction/expense/edit/",
    MONTHLY_REPORT = "/me/report/monthly",
    INFORMATION = "/me/information/"

}

export enum AdminPath {
    HOME = "/admin",
    USERS = "/admin/users",
    USER_DETAIL = "/admin/users/detail/",
    ADMIN_LOG = "/admin/logs",
    PROFILE = "/admin/settings/account/",
    PROFILE_PRIVACY = "/admin/settings/account/privacy",

}