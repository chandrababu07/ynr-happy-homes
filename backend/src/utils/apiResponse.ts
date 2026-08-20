export interface ApiResponseOptions<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export class ApiResponse {
  public static success<T>(message: string, data?: T) {
    return {
      success: true,
      message,
      ...(data !== undefined && { data }),
    };
  }

  public static error(message: string, error?: any) {
    return {
      success: false,
      message,
      ...(error !== undefined && { error }),
    };
  }
}
