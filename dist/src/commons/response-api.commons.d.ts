export declare class ApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string;
    errors: string[];
    constructor(success: boolean, data: T | null, message: string, errors?: string[]);
}
