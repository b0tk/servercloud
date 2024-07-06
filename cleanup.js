const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'zips');
const days = 3;
const now = Date.now();

fs.readdir(dir, (err, files) => {
    if (err) {
        console.error('Unable to read zips directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error('Unable to read file stats:', err);
                return;
            }

            if (now - stats.mtimeMs >= days * 24 * 60 * 60 * 1000) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log(`Deleted file: ${filePath}`);
                    }
                });
            }
        });
    });
});
