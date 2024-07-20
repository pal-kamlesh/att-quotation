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

const quoteInfoSchema = mongoose.Schema({
  workAreaType: {
    type: String,
    enum: [
      "Basement Area",
      "Basement Area (Horizontal)",
      "Basement Area (Vertical)",
      "Retaining Wall",
      "Raft",
      "Plinth",
      "Periphery",
      "Floor",
    ],
    required: true,
  },
  workArea: {
    type: String,
  },
  workAreaUnit: {
    type: String,
    enum: ["Sq.fts", "Sq.mts", "R.fts", "R.mts"],
    validate: {
      validator: function (v) {
        return v === null || this.workArea !== null;
      },
      message: (props) =>
        `${props.value} is required when workArea is provided!`,
    },
  },
  chemicalRate: {
    type: String,
  },
  chemicalRateUnit: {
    type: String,
    enum: ["Per Ltr.", "Lumpsum"],
    validate: {
      validator: function (v) {
        return v === null || this.chemicalRate !== null;
      },
      message: (props) =>
        `${props.value} is required when chemicalRate is provided!`,
    },
  },
  serviceRate: {
    type: String,
    default: null,
  },
  serviceRateUnit: {
    type: String,
    enum: ["Per Sq.ft", "Per Sq.mt", "Per R.ft", "Per R.mt", "Lumpsum"],
    default: null,
    validate: {
      validator: function (v) {
        return v === null || this.serviceRate !== null;
      },
      message: (props) =>
        `${props.value} is required when serviceRate is provided!`,
    },
  },
  applyRate: {
    type: String,
    default: null,
  },
  applyRateUnit: {
    type: String,
    enum: ["Per Sq.ft", "Per Sq.mt", "Per R.ft", "Per R.mt", "Lumpsum"],
    default: null,
    validate: {
      validator: function (v) {
        return v === null || this.applyRate !== null;
      },
      message: (props) =>
        `${props.value} is required when applyRate is provided!`,
    },
  },
  chemical: {
    type: String,
    enum: [
      "Chloropyriphos 20% EC",
      "Imidachloprid 30.5% SC",
      "Imidachloprid 30.5% SC 'Termida'",
      'Imidachloprid 30.5% SC ("PREMISE" - By Bayer India/ENVU)',
    ],
    required: true,
  },
  chemicalQuantity: {
    type: String,
    default: null,
  },
});
const counterSchema = new mongoose.Schema({
  _id: { type: String, default: "quotationCounter" },
  seq: { type: Number, default: 2 },
});
const quotationSchema = mongoose.Schema(
  {
    quotationNo: {
      type: String,
      default: null,
    },
    quotationDate: {
      type: Date,
    },
    kindAttention: {
      type: String,
    },
    kindAttentionPrefix: {
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
      kci: {
        type: [
          {
            id: {
              type: String,
            },
            name: {
              type: String,
            },
            designation: {
              type: String,
            },
            contact: {
              type: String,
            },
            email: {
              type: String,
            },
          },
        ],
      },
    },
    reference: [{ type: String }],
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
      kci: {
        type: [
          {
            id: {
              type: String,
            },
            name: {
              type: String,
            },
            designation: {
              type: String,
            },
            contact: {
              type: String,
            },
            email: {
              type: String,
            },
          },
        ],
      },
    },
    emailTo: {
      type: String,
      default: "",
    },
    treatmentType: {
      type: String,
      default: "Anti-Termite Treatment",
    },
    specification: {
      type: String,
      enum: [
        "As per IS 6313 (Part 2):2013 & 2022",
        "As per IS 6313 (Part 2):2013",
      ],
      required: true,
    },
    equipments: {
      type: String,
      required: true,
      default:
        "Sprayers & Sprinklers will be used to ensure proper penetration of chemicals into the earth.",
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
    note: {
      type: String,
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
    quoteInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuoteInfo" }],
  },
  { timestamps: true }
);

quotationSchema.plugin(mongooseLeanVirtuals);

// Define the virtual property 'subject'
quotationSchema.virtual("subject").get(function () {
  return this.docType === "supply"
    ? "Supply Offer for Chemical as per your requirement."
    : `Pre Construction Anti Termite Treatment to your ${this.shipToAddress.projectName}`;
});
quotationSchema.virtual("archive", {
  ref: "QuoteArchive",
  localField: "_id",
  foreignField: "quotationId",
  justOne: true,
});

// Set the virtual property to be populated by default
quotationSchema.set("toObject", { virtuals: true });
quotationSchema.set("toJSON", { virtuals: true });
quoteArchiveSchema.set("toObject", { virtuals: true });
quoteArchiveSchema.set("toJSON", { virtuals: true });

// quotationSchema.pre("save", async function (next) {
//   try {
//     if (!this.isNew && !this.isModified("quotationNo")) {
//       return next();
//     }
//     let newQuoteNo;

//     if (this.isNew) {
//       // For new quotations
//       const highestQuote = await this.constructor
//         .findOne({}, "quotationNo")
//         .sort({ createdAt: -1 })
//         .limit(1);

//       if (highestQuote) {
//         const highestQuoteNo = Number(highestQuote.quotationNo.split("/")[3]);
//         newQuoteNo = `EPPL/ATT/QTN/${highestQuoteNo + 1}`;
//       } else {
//         newQuoteNo = `EPPL/ATT/QTN/1`;
//       }
//     } else {
//       // For revised quotations
//       const parts = this.quotationNo.split("/");

//       if (parts.length === 5 && parts[4].startsWith("R")) {
//         // If already revised, increment the revision number
//         const revisionNumber = parseInt(parts[4].substring(1)) + 1;
//         parts[4] = `R${revisionNumber}`;
//       } else if (parts.length === 4) {
//         // If first revision, add /R1
//         parts.push("R1");
//       } else {
//         // Unexpected format, just append /R1
//         newQuoteNo = `${this.quotationNo}/R1`;
//       }

//       if (!newQuoteNo) {
//         newQuoteNo = parts.join("/");
//       }
//     }

//     this.quotationNo = newQuoteNo;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

quotationSchema.pre("remove", async function (next) {
  const quoteHistory = await QuoteHistory.findOne({
    quotationNo: this.quotationNo,
  });
  if (quoteHistory) {
    await quoteHistory.deleteOne({ _id: quoteHistory._id });
  }
  next();
});

quotationSchema.pre("findOneAndUpdate", async function (next) {
  try {
    // Access the query object to find the existing document
    const query = this.getQuery();

    // Fetch the existing document
    const existingDoc = await this.model.findOne(query).exec();

    if (!existingDoc) {
      return next(new Error("Document not found"));
    }

    // Check the existing value of `approved` and `quotationNo`
    const isApproved = existingDoc.approved;
    const currentQuotationNo = existingDoc.quotationNo;

    // If not approved skip the update
    if (!isApproved) {
      return next();
    }

    // Process the existing quotationNo
    const parts = currentQuotationNo.split("/");
    let newQuotationNo;

    if (parts.length === 5 && parts[4].startsWith("R")) {
      // If already revised, increment the revision number
      const revisionNumber = parseInt(parts[4].substring(1)) + 1;
      parts[4] = `R${revisionNumber}`;
      newQuotationNo = parts.join("/");
    } else if (parts.length === 4) {
      // If first revision, add /R1
      newQuotationNo = `${currentQuotationNo}/R1`;
    } else {
      // Unexpected format, just append /R1
      newQuotationNo = `${currentQuotationNo}/R1`;
    }

    // Modify the update operation to include the new quotation number
    this.setUpdate({
      quotationNo: newQuotationNo,
      quotationDate: new Date(),
    });

    next();
  } catch (error) {
    next(error);
  }
});

quotationSchema.methods.approve = async function () {
  this.approved = true;
  this.quotationNo = await this.constructor.generateQuotationNo();
  return this.save();
};
quotationSchema.statics.isApproved = async function (id) {
  const doc = await this.findById(id, "approved");
  return doc ? doc.approved : false;
};
quotationSchema.methods.reviseQuotationNo = async function () {
  if (!this.approved) {
    return;
  } else {
    const currentQuotationNo = this.quotationNo;
    // Process the existing quotationNo
    const parts = currentQuotationNo.split("/");
    let newQuotationNo;
    if (parts.length === 5 && parts[4].startsWith("R")) {
      // If already revised, increment the revision number
      const revisionNumber = parseInt(parts[4].substring(1)) + 1;
      parts[4] = `R${revisionNumber}`;
      newQuotationNo = parts.join("/");
    } else if (parts.length === 4) {
      // If first revision, add /R1
      newQuotationNo = `${currentQuotationNo}/R1`;
    } else {
      // Unexpected format, just append /R1
      newQuotationNo = `${currentQuotationNo}/R1`;
    }
    this.quotationNo = newQuotationNo;
    return this.save();
  }
};
quotationSchema.statics.generateQuotationNo = async function () {
  try {
    // Check if the counter document exists
    let counter = await Counter.findById("quotationCounter");

    // If the counter document does not exist, create it with the default value
    if (!counter) {
      counter = await new Counter({ _id: "quotationCounter", seq: 1 }).save();
    }

    // Increment the counter and get the new sequence number
    counter = await Counter.findByIdAndUpdate(
      "quotationCounter",
      { $inc: { seq: 1 } },
      { new: true }
    );

    // Generate the new quotation number using the counter
    const newQuoteNo = `EPPL/ATT/QTN/${counter.seq}`;

    // Optionally, you can add a check to ensure the generated number is unique
    const existingQuote = await this.findOne({ quotationNo: newQuoteNo });
    if (existingQuote) {
      // If by any chance the number already exists, recursively try again
      return this.generateQuotationNo();
    }

    return newQuoteNo;
  } catch (error) {
    console.error("Error generating quotation number:", error);
    throw error;
  }
};

const Quotation = mongoose.model("Quotation", quotationSchema);
const QuoteInfo = mongoose.model("QuoteInfo", quoteInfoSchema);
const QuoteArchive = mongoose.model("QuoteArchive", quoteArchiveSchema);
const Counter = mongoose.model("Counter", counterSchema);
export { Quotation, QuoteInfo, QuoteArchive, Counter };
