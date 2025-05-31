import { HttpStatus } from './status';

type SuccessResponse<T> = {
  status: 'success';
  message: string;
  data: T;
};

type MessageResponse = {
  status: 'success';
  message: string;
};

type ValidationErrorResponse = {
  error: {
    fieldErrors: Record<string, string[]>;
    formErrors: string[];
  };
};

export type ApiResponse<T = unknown> =
  | SuccessResponse<T>
  | MessageResponse
  | ValidationErrorResponse;

export const respond = {
  withData: <T>(message: string, data: T): [number, SuccessResponse<T>] => [
    HttpStatus.OK,
    {
      status: 'success',
      message,
      data,
    },
  ],

  withCreated: <T>(message: string, data: T): [number, SuccessResponse<T>] => [
    HttpStatus.CREATED,
    {
      status: 'success',
      message,
      data,
    },
  ],

  withMessage: (message: string): [number, MessageResponse] => [
    HttpStatus.OK,
    {
      status: 'success',
      message,
    },
  ],

  withError: (
    statusCode: number,
    message: string,
  ): [number, MessageResponse] => [
    statusCode,
    {
      status: 'success',
      message,
    },
  ],

  withValidationError: (
    fieldErrors: Record<string, string[]> = {},
    formErrors: string[] = [],
  ): [number, ValidationErrorResponse] => [
    HttpStatus.BAD_REQUEST,
    {
      error: {
        fieldErrors,
        formErrors,
      },
    },
  ],
} as const;

export { HttpStatus };
