export class AlertFlashModel {
    id: string;
    type: AlertFlashType;
    message: string[];
    autoClose: boolean;
    keepAfterRouteChange: boolean;
    fade: boolean;

    constructor(init?: Partial<AlertFlashModel>) {
        Object.assign(this, init);
    }
}

export enum AlertFlashType {
    Success,
    Error,
    Info,
    Warning
}
