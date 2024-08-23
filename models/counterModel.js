import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, default: "quotationCounter" },
  seq: { type: Number, default: 2 },
});

const chemicalAndBatch = new mongoose.Schema({
  chemical: {
    type: String,
    required: true,
  },
  batchNo: [String],
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
