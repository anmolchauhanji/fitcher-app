import Contractor from "../models/Contractor.model.js";

export const createContractor = async (contractorData) => {
  return await Contractor.create(contractorData);
};

export const findContractorById = async (contractorId) => {
  return await Contractor.findById(contractorId).populate('userId', 'name email');
};

export const findContractorByUserId = async (userId) => {
  return await Contractor.findOne({ userId });
};

export const findContractorByFilter = async (filter = {}) => {
  return await Contractor.find(filter);
};

export const existsContractor = async (filter = {}) => {
  return await Contractor.exists(filter);
};

export const countContractors = async (filter = {}) => {
  return await Contractor.countDocuments(filter);
};

export const updateContractorById = async (
  contractorId,
  updateData
) => {
  return await Contractor.findByIdAndUpdate(
    contractorId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};


export const findNearbyContractors = async (

  longitude,

  latitude,

  radiusInKm = 20

) => {

  return await Contractor.aggregate([

    {

      $geoNear: {

        near: {

          type: "Point",

          coordinates: [

            longitude,

            latitude,

          ],

        },



        distanceField: "distance",



        maxDistance:

          radiusInKm * 1000,



        spherical: true,

      },

    },

  ]);

};





export const findNearbyVerifiedContractors =

  async (

    longitude,

    latitude,

    radiusInKm = 20

  ) => {

    return await Contractor.aggregate([

      {

        $geoNear: {

          near: {

            type: "Point",

            coordinates: [

              longitude,

              latitude,

            ],

          },



          distanceField: "distance",



          maxDistance:

            radiusInKm * 1000,



          spherical: true,



          query: {

            verificationStatus:

              "verified",

          },

        },

      },

    ]);

  };







export const findNearbyContractorsByCategory =

  async (

    longitude,

    latitude,

    category,

    radiusInKm = 20

  ) => {

    return await Contractor.aggregate([

      {

        $geoNear: {

          near: {

            type: "Point",

            coordinates: [

              longitude,

              latitude,

            ],

          },



          distanceField: "distance",



          maxDistance:

            radiusInKm * 1000,



          spherical: true,



          query: {

            verificationStatus:

              "verified",



            tradeCategories:

              category,

          },

        },

      },

    ]);

  };



export const findTopRatedNearbyContractors =

  async (

    longitude,

    latitude,

    radiusInKm = 20

  ) => {

    return await Contractor.aggregate([

      {

        $geoNear: {

          near: {

            type: "Point",

            coordinates: [

              longitude,

              latitude,

            ],

          },



          distanceField: "distance",



          maxDistance:

            radiusInKm * 1000,



          spherical: true,



          query: {

            verificationStatus:

              "verified",

          },

        },

      },



      {

        $sort: {

          averageRating: -1,

          totalCompletedProjects:

            -1,

        },

      },

    ]);

  };


  export const findNearbyVerifiedContractorsByCategory =
  async (
    longitude,
    latitude,
    category,
    radiusInKm = 20
  ) => {
    return await Contractor.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              longitude,
              latitude,
            ],
          },

          distanceField: "distance",

          maxDistance:
            radiusInKm * 1000,

          spherical: true,

          query: {
            verificationStatus: "verified",
            tradeCategories: category,
          },
        },
      },

      {
        $sort: {
          averageRating: -1,
          totalCompletedProjects: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);
  };