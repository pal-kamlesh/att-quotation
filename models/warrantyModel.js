import mongoose from "mongoose";

const warrantySchema = mongoose.Schema(
  {
    chemicalName: {
      type: String,
    },
    warrantyPeriod: {
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
    },
    areaTreated: {},
    structureType: {},
    contractNo: {},
  },
  { timestamps: true }
);
