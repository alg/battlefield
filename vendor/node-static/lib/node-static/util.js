var fs = require('fs');
var path = require('path');

this.mstat = (dir, files, callback) => {
    (function mstat(files, stats) {
        var file = files.shift();

        if (file) {
            fs.stat(path.join(dir, file), (e, stat) => {
                if (e) {
                    callback(e);
                } else {
                    mstat(files, stats.concat([stat]));
                }
            });
        } else {
            callback(null, {
                size: stats.reduce((total, stat) => total + stat.size, 0),
                mtime: stats.reduce((latest, stat) => latest > stat.mtime ? latest : stat.mtime, 0),
                ino: stats.reduce((total, stat) => total + stat.ino, 0)
            });
        }
    })(files.slice(0), []);
};
