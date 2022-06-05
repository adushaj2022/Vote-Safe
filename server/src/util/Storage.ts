import multer from "multer";

const storage = multer.diskStorage({
  destination: "./public",
  filename: (_, file, cb) => {
    cb(null, file.originalname + "." + file?.mimetype?.split("/")[1] ?? "");
  },
});

export const upload = multer({
  storage: storage,
}).single("candidatePhoto");
