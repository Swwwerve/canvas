const express = require('express');
const app = express();
const port = 8080;
const path = require('path');   
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const src = path.join(__dirname);

app.use(express.static(src));

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // no larger than 10mb
    }
})

// Storage instance is created, it can be used to interact with Google Cloud Storage by calling its methods
let projectId = "dysgraphia-classification";
let keyFilename = "mykey.json";
const storage = new Storage({
    projectId,
    keyFilename
})

const bucket = storage.bucket("storage-buckettest"); 


app.post('/upload', multer.single('imgfile'), (req, res) => {
    console.log("made it to /upload");
    try {
        if (req.file) {
            console.log("file found, trying to upload...");
            const blob = bucket.file(req.file.originalname); // POST ID that we created
            const blobStream = blob.createWriteStream();

            blobStream.on('finish', () => {
                res.status(200).send('Success!');
                console.log("Success!");
            });
            blobStream.end(req.file.buffer);
        } else throw "error with image";
    } catch (error) {
        res.status(500).send(error)
    }
});


// Request and response
app.get('/', (req, res) => {
    res.sendFile(src);
});


// Listen on port 8080
app.listen(port, () => {
    console.log(`Server stated on port ${port}`);
});