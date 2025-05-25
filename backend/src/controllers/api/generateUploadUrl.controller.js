const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: "us-east-1",
});

const generateUploadUrl = async (req, res) => {
  const { fileName, contentType } = req.body;
  const command = new PutObjectCommand({
    Bucket: "kua-cs232",
    Key: fileName,
    ContentType: contentType,
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const fileUrl = `https://kua-cs232.s3.us-east-1.amazonaws.com/${fileName}`;

  return res.status(200).json({ uploadUrl, fileUrl });
};

module.exports = generateUploadUrl;
