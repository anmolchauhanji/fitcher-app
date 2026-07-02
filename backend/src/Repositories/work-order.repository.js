import WorkOrder from "../models/WorkOrder.model.js";

export const createWorkOrder = async (
  data
) => {
  return await WorkOrder.create(data);
};

export const findWorkOrderById = async (
  id
) => {
  return await WorkOrder.findById(id);
};

export const findWorkOrderByProjectId =
  async (projectId) => {
    return await WorkOrder.findOne({
      projectId,
    });
  };

export const findWorkOrdersByCustomer =
  async (customerId) => {
    return await WorkOrder.find({
      customerId,
    });
  };

export const findWorkOrdersByContractor =
  async (contractorId) => {
    return await WorkOrder.find({
      contractorId,
    });
  };

export const updateWorkOrderById =
  async (id, data) => {
    return await WorkOrder.findByIdAndUpdate(
      id,
      data,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  };

export const deleteWorkOrderById =
  async (id) => {
    return await WorkOrder.findByIdAndDelete(
      id
    );
  };