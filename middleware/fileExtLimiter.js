const path = require("path");

const fileExtLimiter = (allowedExtArray) => {
    return(req, res, next) => {
        const files = req.files

        const fileExtensions = []
        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        // Are the file extentions allowed?
        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))

        if (!allowed) {
            const  message = `Upload Failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

            return res.status(422).json({ status: "error", message }); // Status 422: Unprocessable Entity
        }

        next()
    }
}

module.exports = fileExtLimiter;