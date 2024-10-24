export class ServiceException extends Error {
    constructor(message) {
        super(message);
        this.name = 'ServiceException';
    }
}

export class CodeExecutionException extends Error {
    constructor(message) {
        super(message);
        this.name = 'CodeExecutionException';
    }
}

export class InvalidCredentialsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidCredentialsException';
    }
}

export class InsufficientPermissionsException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InsufficientPermissionsException';
    }
}

export class NotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundException';
    }
}

export class DatabaseIntegrityException extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseIntegrityException';
    }
}
