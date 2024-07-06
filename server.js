const express = require('express');
const multer = require('multer');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.array('files'), (req, res) => {
    res.redirect('/');
});

app.get('/folders', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read uploads directory' });
        }
        res.json({ folders: files });
    });
});

app.get('/download', (req, res) => {
    const folder = req.query.folder;
    const folderPath = path.join(__dirname, 'uploads', folder);
    const zipPath = path.join(__dirname, 'zips', `${folder}.zip`);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    output.on('close', () => {
        res.download(zipPath, `${folder}.zip`, (err) => {
            if (err) {
                console.error('Error during download:', err);
            }
            fs.unlink(zipPath, (err) => {
                if (err) {
                    console.error('Error deleting zip:', err);
                }
            });
        });
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
});

app.listen(port, () => {
    console.log(`File server running at http://localhost:${port}`);
});
