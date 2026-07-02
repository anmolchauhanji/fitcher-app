import Project from "../models/Project.model.js";
import Bid from "../models/Bid.model.js";
import Contractor from "../models/Contractor.model.js";

export const getCustomerDashboardStats = async (userId) => {
  const [
    totalProjects,
    openProjects,
    completedProjects,
    bidsAggregate,
    recentProjects,
  ] = await Promise.all([
    Project.countDocuments({ customerId: userId }),

    Project.countDocuments({
      customerId: userId,
      status: "open",
    }),

    Project.countDocuments({
      customerId: userId,
      status: "completed",
    }),

    Bid.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $match: {
          "project.customerId": userId,
        },
      },
      {
        $count: "total",
      },
    ]),

    Project.find({ customerId: userId })
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return {
    totalProjects,
    openProjects,
    completedProjects,
    totalBidsReceived:
      bidsAggregate[0]?.total || 0,
    recentProjects,
  };
};

export const getContractorDashboardStats =
  async (userId) => {
    const contractor =
      await Contractor.findOne({ userId });

    if (!contractor) return null;

    const [
      totalBids,
      acceptedBids,
      pendingBids,
      rejectedBids,
    ] = await Promise.all([
      Bid.countDocuments({
        contractorId: contractor._id,
      }),

      Bid.countDocuments({
        contractorId: contractor._id,
        status: "accepted",
      }),

      Bid.countDocuments({
        contractorId: contractor._id,
        status: "pending",
      }),

      Bid.countDocuments({
        contractorId: contractor._id,
        status: "rejected",
      }),
    ]);

    return {
      totalBids,
      acceptedBids,
      pendingBids,
      rejectedBids,
      averageRating:
        contractor.averageRating,
      verificationStatus:
        contractor.verificationStatus,
      completedProjects:
        contractor.totalCompletedProjects,
    };
  };