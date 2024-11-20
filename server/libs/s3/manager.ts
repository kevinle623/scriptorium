import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadFile } from "@/types/dtos/file";
import s3Client from "@server/libs/s3/client";

function isNodeFile(file: UploadFile): file is { filepath: string; originalFilename: string; mimetype: string } {
    return "filepath" in file;
}

export async function uploadFileToS3(
    file: UploadFile,
    folder: string = "uploads",
    fileName?: string
): Promise<string> {
    try {
        let fileBuffer: Buffer;
        let originalFilename: string;
        let mimetype: string;

        if ("arrayBuffer" in file && typeof file.arrayBuffer === "function") {
            fileBuffer = Buffer.from(await file.arrayBuffer());
            originalFilename = file.name;
            mimetype = file.type;
        } else if (isNodeFile(file)) {
            fileBuffer = await fs.promises.readFile(file.filepath);
            originalFilename = file.originalFilename;
            mimetype = file.mimetype;
        } else {
            throw new Error("Unsupported file type.");
        }

        const key = `${folder}/${fileName || `${uuidv4()}-${originalFilename}`}`;
        console.log("Uploading file with key:", key);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: fileBuffer,
            ContentType: mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return fileUrl;
    } catch (e) {
        console.error("Something went wrong with S3:", e);
        throw new Error(`S3 upload failed: ${(e as Error).message}`);
    }
}
