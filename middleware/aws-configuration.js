const fs = require("fs");
const AWS = require("aws-sdk");


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_API_KEY,
  secretAccessKey: process.env.AWS_API_SECRET,
});


 const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: process.env.AWS_API_BUCKET_NAME,
    Key: "logo.png", // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

module.exports = uploadFile;