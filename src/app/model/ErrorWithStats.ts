//Instantiating class that has a more intuitive typing to rescue the error, and its due status
export class ErrorWithStats {
    message: string;
    status: number;

    constructor(message: string, status: number) {
        this.message = message;
        this.status = status;
    }
}
