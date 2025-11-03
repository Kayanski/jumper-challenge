export type BackendResponse<T> = {
    success: boolean;
    message: string;
    responseObject: T;
    statusCode: number;
}