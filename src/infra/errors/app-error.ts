export class AppError extends Error {
  constructor(
    readonly message: string = "Internal Server Error",
    readonly statusCode: number = 500
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
