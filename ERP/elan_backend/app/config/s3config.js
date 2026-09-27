// const AWS = require('aws-sdk');
// const fs = require('fs')
// const signedUrlExpireSeconds = 60 * 1
 
// const client = new AWS.S3({
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//     region: process.env.REGION,
//     signatureVersion: 'v4',
//     ACL: "public-read",

// });
 
// const s3 = {
//     client: client,
//     bucket_name: process.env.BUCKET_NAME
// };


// const uploadToS3 = (docstore) => {
//     const fileContant = fs.readFileSync(docstore)
//     return new Promise((resolve, reject) => {

//         const params = {
//             Bucket: s3.bucket_name,
//             Key: docstore,    // replace space in a filename with hyphen
//             Body: fileContant,
//             Body: docstore,
//             Expires: signedUrlExpireSeconds

                   
//         };
//         client.upload(params,  (err, data) => {
//             if (err) {
//                 console.log(err);
//                 reject()
//             } else {
//                 resolve(data.Location)
                
//             }
//         })
       
//     })
   
// }
// module.exports = {uploadToS3};