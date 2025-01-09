export class ApiResponse<T> {
    constructor(
      public success: boolean,
      public data: T | null,
      public message: string,
      public errors: string[] = [],
    ) {}
  }
  