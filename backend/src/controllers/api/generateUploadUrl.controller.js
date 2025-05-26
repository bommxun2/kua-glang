const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: "us-east-1" });

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : event;

    const { fileName, contentType } = body;

    if (!fileName || !contentType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing fileName or contentType" }),
      };
    }

    const command = new PutObjectCommand({
      Bucket: "cs232-kua",
      Key: fileName,
      ContentType: contentType,
      ACL: "public-read",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const fileUrl = `https://cs232-kua.s3.us-east-1.amazonaws.com/${fileName}`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uploadUrl, fileUrl }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error!!" }),
    };
  }
};
