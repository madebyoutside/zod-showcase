import type { ApiError } from "@/features/common/schemas/api-error.schema";

export class HttpError extends Error {
  readonly status: number;
  readonly body: ApiError;

  constructor({ status, body }: { status: number; body: ApiError }) {
    super(body.message);
    this.status = status;
    this.body = body;
  }
}
