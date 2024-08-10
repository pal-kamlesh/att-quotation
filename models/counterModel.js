import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const counterSchema = new mongoose.Schema({
  _id: { type: String, default: "quotationCounter" },
  seq: { type: Number, default: 2 },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;
