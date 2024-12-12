export interface ApiResponse<T> {
    code: number;
    result: T[];
}

export interface ApiResponseV2<T> {
  code: number;
  result: T;
}
