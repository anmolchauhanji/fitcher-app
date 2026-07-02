import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let folder = "general";

    switch (req.uploadType) {
      case "aadhar":
        folder = "buildmatch/contractors/aadhar";
        break;

      case "pan":
        folder = "buildmatch/contractors/pan";
        break;

      case "portfolio":
        folder = "buildmatch/contractors/portfolio";
        break;

      case "project":
        folder = "buildmatch/projects";
        break;

      case "profile":
        folder = "buildmatch/profile";
        break;
    }

    return {
      folder,

      resource_type: "image",

      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp",
      ],

      transformation: [
        {
          width: 1600,
          crop: "limit",
        },
        {
          quality: "auto",
        },
        {
          fetch_format: "auto",
        },
      ],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed."
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;