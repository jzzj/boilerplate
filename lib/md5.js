var crypto = require('crypto');

export default function md5(content, type){
    type = type || "md5";
    var md5sum = crypto.createHash(type);
    md5sum.update(String(content));
    return md5sum.digest("hex");
}