const multer = require("multer")

// Déclaration des formats autorisés
const MINE_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

// Déclaration de storage qui permet de sauvegarder les images
// en leur indiquant la destination, et en changeant le nom
// de l'image ainsi que l'extension
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images/freelanceExp");
  },
  filename: (req, file, callback) => {
    const name = file.fieldname.split(" ").join("_");
    const extension = MINE_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).array("imgUrl");