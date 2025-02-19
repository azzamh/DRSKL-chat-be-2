export class SuccessResponse {
  data: any;
  status: number;
  constructor(status: number, data: any) {
    this.status = status;
    this.data = data;
  }
  generate() {
    return {
      data: Array.isArray(this.data) ? [...this.data] : { ...this.data },
      status: this.status
    }
  }
}

export class CreatedResponse extends SuccessResponse {
  constructor(data: any) {
    super(201, data);
  }
}

export class OkResponse extends SuccessResponse {
  constructor(data: any) {
    super(200, data);
  }
}

export class NoContentResponse extends SuccessResponse {
  constructor() {
    super(204, {});
  }
}

export class AcceptedResponse extends SuccessResponse {
  constructor() {
    super(202, {});
  }
} 

export class ResetContentResponse extends SuccessResponse {
  constructor() {
    super(205, {});
  }
}