const { S3 } = require("aws-sdk");
const { param } = require("../routes/product");
const uuid = require("uuid").v4

exports.s3Uploadv2 = async (mainImage, images) => {
    const s3 = new S3();

    const mainImageParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${mainImage.originalname}`,
        Body: mainImage.buffer
    };

    const imagesParams = images.map(image => ({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${uuid()}-${image.originalname}`,
        Body: image.buffer
    }));

    const uploadPromises = [s3.upload(mainImageParams).promise(), ...imagesParams.map(param => s3.upload(param).promise())];

    // await all s3 upload
    return await Promise.all(uploadPromises);
    //s3 is callback based, turn into promise

};