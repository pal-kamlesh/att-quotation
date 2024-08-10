import mongoose from "mongoose";

const contractSchema = mongoose.Schema(
  {
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
    },
    contractNo: {
      type: String,
    },
    billToAddress: {
      prefix: {
        type: String,
        enum: ["M/s.", "Mr.", "Mrs.", "Miss."],
        default: "M/s.",
      },
      name: String,
      a1: String,
      a2: String,
      a3: String,
      a4: String,
      a5: String,
      a6: String,
      city: String,
      pincode: String,
      kci: [
        {
          name: String,
          designation: String,
          contact: String,
          email: String,
        },
      ],
    },
    shipToAddress: {
      projectName: String,
      a1: String,
      a2: String,
      a3: String,
      a4: String,
      a5: String,
      a6: String,
      city: String,
      pincode: String,
      kci: [
        {
          name: String,
          designation: String,
          contact: String,
          email: {
            type: String,
            lowercase: true,
          },
        },
      ],
    },
    paymentTerms: {
      type: String,
      default: "Within 15 days from the date of submission of bill.",
    },
    taxation: {
      type: String,
      default: "GST @ 18% As Applicable.",
    },
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    docType: {
      type: String,
      enum: ["standard", "supply/apply", "supply"],
      default: "standard",
    },
    printCount: {
      type: Number,
      default: 0,
    },
    workOrderNo: { type: Number },
    workOrderDate: { type: Date },
    gstNo: { type: String },
    quoteInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuoteInfo" }],
  },
  { timestamps: true }
);

contractSchema.virtual("archive", {
  ref: "QuoteArchive",
  localField: "_id",
  foreignField: "quotationId",
  justOne: true,
});

contractSchema.virtual("workLog", {
  ref: "WorkLog",
  localField: "_id",
  foreignField: "contractId",
  justOne: true,
});

// Set the virtual property to be populated by default
contractSchema.set("toObject", { virtuals: false });
contractSchema.set("toJSON", { virtuals: false });

contractSchema.methods.approve = async function () {
  this.approved = true;
  return this.save();
};
contractSchema.methods.incPrintCount = async function () {
  this.printCount = this.printCount + 1;
  return this.save();
};

contractSchema.statics.isApproved = async function (id) {
  const doc = await this.findById(id, "approved");
  return doc ? doc.approved : false;
};

const Contract = mongoose.model("Contract", contractSchema);
export default Contract;
