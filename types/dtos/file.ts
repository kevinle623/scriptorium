export type UploadFile =
    | File
    | {
    filepath: string;
    originalFilename: string;
    mimetype: string;
};