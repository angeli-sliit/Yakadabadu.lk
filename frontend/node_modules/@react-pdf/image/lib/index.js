import fs from 'fs';
import url from 'url';
import path from 'path';
import _PNG from '@react-pdf/png-js';
import _JPEG from 'jay-peg';

class PNG {
    data;
    width;
    height;
    format;
    constructor(data) {
        const png = new _PNG(data);
        this.data = data;
        this.width = png.width;
        this.height = png.height;
        this.format = 'png';
    }
    static isValid(data) {
        try {
            return !!new PNG(data);
        }
        catch {
            return false;
        }
    }
}

class JPEG {
    data;
    width;
    height;
    format;
    constructor(data) {
        this.data = data;
        this.format = 'jpeg';
        this.width = 0;
        this.height = 0;
        if (data.readUInt16BE(0) !== 0xffd8) {
            throw new Error('SOI not found in JPEG');
        }
        const markers = _JPEG.decode(this.data);
        let orientation;
        for (let i = 0; i < markers.length; i += 1) {
            const marker = markers[i];
            if (marker.name === 'EXIF' && marker.entries.orientation) {
                orientation = marker.entries.orientation;
            }
            if (marker.name === 'SOF') {
                this.width ||= marker.width;
                this.height ||= marker.height;
            }
        }
        if (orientation > 4) {
            [this.width, this.height] = [this.height, this.width];
        }
    }
    static isValid(data) {
        return data && Buffer.isBuffer(data) && data.readUInt16BE(0) === 0xffd8;
    }
}

const createCache = ({ limit = 100 } = {}) => {
    let cache = {};
    let keys = [];
    return {
        get: (key) => (key ? cache[key] : null),
        set: (key, value) => {
            keys.push(key);
            if (keys.length > limit) {
                delete cache[keys.shift()];
            }
            cache[key] = value;
        },
        reset: () => {
            cache = {};
            keys = [];
        },
        length: () => keys.length,
    };
};

const IMAGE_CACHE = createCache({ limit: 30 });
const isBuffer = Buffer.isBuffer;
const isBlob = (src) => {
    return typeof Blob !== 'undefined' && src instanceof Blob;
};
const isDataImageSrc = (src) => {
    return 'data' in src;
};
const isBase64Src = (imageSrc) => 'uri' in imageSrc &&
    /^data:image\/[a-zA-Z]*;base64,[^"]*/g.test(imageSrc.uri);
const getAbsoluteLocalPath = (src) => {
    const { protocol, auth, host, port, hostname, path: pathname, } = url.parse(src);
    const absolutePath = pathname ? path.resolve(pathname) : undefined;
    if ((protocol && protocol !== 'file:') || auth || host || port || hostname) {
        return undefined;
    }
    return absolutePath;
};
const fetchLocalFile = (src) => new Promise((resolve, reject) => {
    try {
        if (false) ;
        const absolutePath = getAbsoluteLocalPath(src.uri);
        if (!absolutePath) {
            reject(new Error(`Cannot fetch non-local path: ${src}`));
            return;
        }
        fs.readFile(absolutePath, (err, data) => err ? reject(err) : resolve(data));
    }
    catch (err) {
        reject(err);
    }
});
const fetchRemoteFile = async (src) => {
    const { method = 'GET', headers, body, credentials } = src;
    const response = await fetch(src.uri, {
        method,
        headers,
        body,
        credentials,
    });
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
};
const isValidFormat = (format) => {
    const lower = format.toLowerCase();
    return lower === 'jpg' || lower === 'jpeg' || lower === 'png';
};
const guessFormat = (buffer) => {
    let format;
    if (JPEG.isValid(buffer)) {
        format = 'jpg';
    }
    else if (PNG.isValid(buffer)) {
        format = 'png';
    }
    return format;
};
function getImage(body, format) {
    switch (format.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
            return new JPEG(body);
        case 'png':
            return new PNG(body);
        default:
            return null;
    }
}
const resolveBase64Image = async ({ uri }) => {
    const match = /^data:image\/([a-zA-Z]*);base64,([^"]*)/g.exec(uri);
    if (!match)
        throw new Error(`Invalid base64 image: ${uri}`);
    const format = match[1];
    const data = match[2];
    if (!isValidFormat(format))
        throw new Error(`Base64 image invalid format: ${format}`);
    return getImage(Buffer.from(data, 'base64'), format);
};
const resolveImageFromData = async (src) => {
    if (src.data && src.format) {
        return getImage(src.data, src.format);
    }
    throw new Error(`Invalid data given for local file: ${JSON.stringify(src)}`);
};
const resolveBufferImage = async (buffer) => {
    const format = guessFormat(buffer);
    if (format) {
        return getImage(buffer, format);
    }
    return null;
};
const resolveBlobImage = async (blob) => {
    const { type } = blob;
    if (!type || type === 'application/octet-stream') {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return resolveBufferImage(buffer);
    }
    if (!type.startsWith('image/')) {
        throw new Error(`Invalid blob type: ${type}`);
    }
    const format = type.replace('image/', '');
    if (!isValidFormat(format)) {
        throw new Error(`Invalid blob type: ${type}`);
    }
    const buffer = await blob.arrayBuffer();
    return getImage(Buffer.from(buffer), format);
};
const getImageFormat = (body) => {
    const isPng = body[0] === 137 &&
        body[1] === 80 &&
        body[2] === 78 &&
        body[3] === 71 &&
        body[4] === 13 &&
        body[5] === 10 &&
        body[6] === 26 &&
        body[7] === 10;
    const isJpg = body[0] === 255 && body[1] === 216 && body[2] === 255;
    let extension = '';
    if (isPng) {
        extension = 'png';
    }
    else if (isJpg) {
        extension = 'jpg';
    }
    else {
        throw new Error('Not valid image extension');
    }
    return extension;
};
const resolveImageFromUrl = async (src) => {
    const data = getAbsoluteLocalPath(src.uri)
        ? await fetchLocalFile(src)
        : await fetchRemoteFile(src);
    const format = getImageFormat(data);
    return getImage(data, format);
};
const getCacheKey = (src) => {
    if (isBlob(src) || isBuffer(src))
        return null;
    if (isDataImageSrc(src))
        return src.data.toString();
    return src.uri;
};
const resolveImage = (src, { cache = true } = {}) => {
    let image;
    const cacheKey = getCacheKey(src);
    if (isBlob(src)) {
        image = resolveBlobImage(src);
    }
    else if (isBuffer(src)) {
        image = resolveBufferImage(src);
    }
    else if (cache && IMAGE_CACHE.get(cacheKey)) {
        return IMAGE_CACHE.get(cacheKey);
    }
    else if (isBase64Src(src)) {
        image = resolveBase64Image(src);
    }
    else if (isDataImageSrc(src)) {
        image = resolveImageFromData(src);
    }
    else {
        image = resolveImageFromUrl(src);
    }
    if (!image) {
        throw new Error('Cannot resolve image');
    }
    if (cache && cacheKey) {
        IMAGE_CACHE.set(cacheKey, image);
    }
    return image;
};

export { resolveImage as default };
