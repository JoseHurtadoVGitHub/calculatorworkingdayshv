import { isObject, isString } from "../utils/utils";

export class HttpException extends Error {
  private readonly response: string | Record<string, any>;
  private readonly status: number;

  constructor(response: string | Record<string, any>, status: number) {
    super();
    this.response = response;
    this.status = status;
    Object.setPrototypeOf(this, HttpException.prototype);
    this.initMessage();
  }

  public initMessage() {
    if (isString(this.response)) {
      this.message = this.response as string;
    } else if (isObject(this.response) && isString(this.response.message)) {
      this.message = this.response.message;
    } else if (this.constructor) {
      this.message =
        this.constructor.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(" ") ??
        "Error";
    }
  }

  public initName(): void {
    this.name = this.constructor.name;
  }

  public getResponse(): string | object {
    return this.response;
  }

  public getStatus(): number {
    return this.status;
  }
}
