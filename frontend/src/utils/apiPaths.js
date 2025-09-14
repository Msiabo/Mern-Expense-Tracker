export const API_BASE_URL = 'https://mern-expense-tracker-iota.vercel.app';

export const API_PATHS = {
    AUTH : {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
        LOGOUT: '/api/v1/auth/logout',
        GET_USER_INFO: '/api/v1/auth/getUser',
        UPDATE_USER_INFO: '/api/v1/auth/update',
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: '/api/v1/dashboard',
    },
    EXPENSES: {
        GET_EXPENSES: '/api/v1/expense',
        ADD_EXPENSE: '/api/v1/expense',
        UPDATE_EXPENSE: '/api/v1/expense', // Use with /:id
        DELETE_EXPENSE: '/api/v1/expense', // Use with /:id
        DOWNLOAD_EXPENSE:'api/v1/expenses/download'
    },
    INCOMES: {
        GET_INCOMES: '/api/v1/income',
        ADD_INCOME: '/api/v1/income',
        UPDATE_INCOME: '/api/v1/income', // Use with /:id
        DELETE_INCOME: '/api/v1/income', // Use with /:id
        DOWNLOAD_INCOME:'/api/v1/income/download'
    },
    UPLOAD_IMAGE:{
        UPLOAD: '/api/v1/auth/uploadProfileImage',
    },

};
        