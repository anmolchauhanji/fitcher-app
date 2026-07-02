import asyncHandler from "../lib/asyncHandler.js";
import ApiError from "../lib/ApiError.js";
import { successResponse } from "../lib/response.js";

import {
  uploadImage,
  uploadAadharService,
  uploadPanService,
  uploadPortfolioService,
  uploadProjectImagesService,
} from "../service/upload.service.js";
const FOLDERS = {
  aadhar: "buildmatch/contractors/aadhar",
  pan: "buildmatch/contractors/pan",
  portfolio: "buildmatch/contractors/portfolio",
  project: "buildmatch/projects",
  profile: "buildmatch/profile",
};

export const uploadSingleImage = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "Image is required");
    }

    const folder =
      FOLDERS[req.params.type];

    if (!folder) {
      throw new ApiError(
        400,
        "Invalid upload type"
      );
    }

    const image = await uploadImage(
      req.file.buffer,
      folder
    );

    return successResponse(
      res,
      200,
      "Image uploaded successfully",
      image
    );
  }
);

export const uploadMultipleImages =
  asyncHandler(async (req, res) => {
    if (
      !req.files ||
      req.files.length === 0
    ) {
      throw new ApiError(
        400,
        "Images are required"
      );
    }

    const folder =
      FOLDERS[req.params.type];

    if (!folder) {
      throw new ApiError(
        400,
        "Invalid upload type"
      );
    }

    const images = await Promise.all(
      req.files.map((file) =>
        uploadImage(file.buffer, folder)
      )
    );

    return successResponse(
      res,
      200,
      "Images uploaded successfully",
      images
    );
  });


  export const uploadAadhar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Aadhaar image is required");
  }

  const image = await uploadImage(
    req.file.buffer,
    "buildmatch/contractors/aadhar"
  );

  const contractor = await uploadAadharService(
    req.user.id,
    image
  );

  return successResponse(
    res,
    200,
    "Aadhaar uploaded successfully",
    contractor
  );
});


export const uploadPan = asyncHandler(async (req, res) => {

  if (!req.file) {

    throw new ApiError(400, "PAN image is required");

  }



  const image = await uploadImage(

    req.file.buffer,

    "buildmatch/contractors/pan"

  );



  const contractor = await uploadPanService(

    req.user.id,

    image

  );



  return successResponse(

    res,

    200,

    "PAN uploaded successfully",

    contractor

  );

});



export const uploadPortfolio = asyncHandler(async (req, res) => {

  if (!req.files?.length) {

    throw new ApiError(400, "Portfolio images are required");

  }



  const images = await Promise.all(

    req.files.map((file) =>

      uploadImage(

        file.buffer,

        "buildmatch/contractors/portfolio"

      )

    )

  );



  const contractor =

    await uploadPortfolioService(

      req.user.id,

      images

    );



  return successResponse(

    res,

    200,

    "Portfolio uploaded successfully",

    contractor

  );

});





export const uploadProjectImages =

  asyncHandler(async (req, res) => {

    if (!req.files?.length) {

      throw new ApiError(

        400,

        "Project images are required"

      );

    }



    const images = await Promise.all(

      req.files.map((file) =>

        uploadImage(

          file.buffer,

          "buildmatch/projects"

        )

      )

    );



    const project =

      await uploadProjectImagesService(

        req.user.id,

        req.params.projectId,

        images

      );



    return successResponse(

      res,

      200,

      "Project images uploaded successfully",

      project

    );

  });