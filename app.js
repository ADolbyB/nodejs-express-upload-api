const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

// Middleware:
const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3500;

const app = express();

// Define a route to the index.html: our default web route @ root of application.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

//Create Upload Route:
app.post("/upload", 
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg", ".webp"]),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files) // Shows in the NODE terminal

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, "files", files[key].name)
            
            files[key].mv(filepath, (err) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: err }) // Status 500: Server Error
                }
            })
        })

        return res.json({ status: "success", message: Object.keys(files).toString() })
    }
)

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));