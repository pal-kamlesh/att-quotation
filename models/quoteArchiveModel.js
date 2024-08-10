import mongoose from "mongoose";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

const quoteArchiveSchema = mongoose.Schema({
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  revisions: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      state: {
        type: Object,
        required: true,
      },
      message: {
        type: String,
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

quoteArchiveSchema.plugin(mongooseLeanVirtuals);

quoteArchiveSchema.set("toObject", { virtuals: true });
quoteArchiveSchema.set("toJSON", { virtuals: true });

const QuoteArchive = mongoose.model("QuoteArchive", quoteArchiveSchema);

export default QuoteArchive;
