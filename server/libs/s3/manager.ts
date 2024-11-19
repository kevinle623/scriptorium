import fs from "fs/promises";
import s3Client from "@server/libs/s3/client";
import { v4 as uuidv4 } from "uuid";

export async function uploadFileToS3(file, folder = "uploads", fileName = undefined) {
    try {
        let fileBuffer;
        let originalFilename;
        let mimetype;

        if (file.arrayBuffer) {
            fileBuffer = Buffer.from(await file.arrayBuffer());
            originalFilename = file.name;
            mimetype = file.type;
        } else {
            const { filepath, originalFilename: formidableFilename, mimetype: formidableMimetype } = file;
            fileBuffer = await fs.promises.readFile(filepath);
            originalFilename = formidableFilename;
            mimetype = formidableMimetype;
        }

        const key = `${folder}/${fileName || `${uuidv4()}-${originalFilename}`}`;
        console.log("Uploading file with key:", key);

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: mimetype,
        };

        await s3Client.upload(params).promise();

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        return fileUrl;
    } catch (e) {
        console.error("Something went wrong with S3:", e);
        throw new Error(`S3 upload failed: ${e.message}`);
    }
}
