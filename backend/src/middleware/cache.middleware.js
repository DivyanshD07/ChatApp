export const disableCache = (req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
}

export const enableCache = (maxAge = 600) => {
    return (req,res,next) => {
        res.setHeader("Cache-Control", `public, max-age=${maxAge}`);
        next();
    }
}