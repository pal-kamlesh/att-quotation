import mongoose from "mongoose";
import { Counter } from "./index.js";

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
    dcs: [{ type: mongoose.Schema.Types.ObjectId, ref: "DC" }],
    worklogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkLogs" }],
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
contractSchema.methods.generateContractNo = async function () {
  try {
    // Find the counter document for contract numbers
    let counter = await Counter.findById("contractCounter");

    // If the counter document does not exist, create it
    if (!counter) {
      counter = await new Counter({ _id: "contractCounter", seq: 1 }).save();
    }

    // Increment the counter and get the new sequence number
    counter = await Counter.findByIdAndUpdate(
      "contractCounter",
      { $inc: { seq: 1 } },
      { new: true }
    );

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Generate the new contract number using the counter
    const newContractNo = `PRE/${counter.seq}/${currentYear}`;

    // Set the generated contract number on the current document
    this.contractNo = newContractNo;

    // Optionally, you can add a check to ensure the generated number is unique

    // Save the current document with the new contract number
    return this.save();
  } catch (error) {
    // Log the error and rethrow it
    console.error("Error generating contract number:", error);
    throw error;
  }
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
