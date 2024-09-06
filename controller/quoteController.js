import { Quotation, QuoteInfo } from "../models/index.js";
import { isValidObjectId } from "mongoose";
import {
  removeIdFromDocuments,
  remove_IdFromObj,
  differenceBetweenArrays,
  createQuoteArchiveEntry,
} from "../utils/functions.js";

const create = async (req, res, next) => {
  try {
    const { quote } = req.body;
    const {
      quotationDate,
      kindAttention,
      kindAttentionPrefix,
      reference,
      salePerson,
      billToAddress,
      shipToAddress,
      specification,
      note,
      quotationNo,
      docType,
      emailTo,
    } = quote;
    const { projectName } = shipToAddress;
    if (!projectName || !specification) {
      return res
        .status(400)
        .json({ message: "Project name and specification are required." });
    }
    billToAddress.kci = removeIdFromDocuments(billToAddress.kci);
    shipToAddress.kci = removeIdFromDocuments(shipToAddress.kci);
    let quoteInfoIds = [];
    for (let i = 0; i < quote.quoteInfo.length; i++) {
      const quoteData = remove_IdFromObj(quote.quoteInfo[i]);
      const newInfo = await QuoteInfo.create(quoteData);
      quoteInfoIds.push(newInfo._id);
    }

    // Create Quotation instance
    const newQuotation = await Quotation.create({
      quotationDate: quotationDate || Date.now(),
      billToAddress,
      kindAttention,
      kindAttentionPrefix,
      reference,
      shipToAddress,
      projectName,
      specification,
      salesPerson: salePerson,
      createdBy: req.user.id,
      quoteInfo: quoteInfoIds,
      note,
      quotationNo,
      emailTo,
      docType,
    });

    const populatedQuotation = await newQuotation.populate(
      "createdBy",
      "username"
    );

    if (newQuotation) {
      res
        .status(200)
        .json({ message: "Quotation Created!", result: populatedQuotation });
    } else {
      res.status(500).json({ message: "Quotation creation failed." });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const quotes = async (req, res, next) => {
  try {
    // Parse and set start and end of the day for fromDate and toDate
    const startOfDay = req.query.fromDate
      ? new Date(req.query.fromDate)
      : new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = req.query.toDate ? new Date(req.query.toDate) : new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Build the query object
    const query = {
      ...(req.query.createdBy && {
        createdBy: req.query.createdBy,
      }),
      ...(req.query.projectName && {
        "shipToAddress.projectName": {
          $regex: new RegExp(req.query.projectName, "i"),
        },
      }),
      ...(req.query.clientName && {
        "billToAddress.name": {
          $regex: new RegExp(req.query.clientName, "i"),
        },
      }),
      ...(req.query.quotationNo && {
        quotationNo: { $regex: new RegExp(req.query.quotationNo, "i") },
      }),
    };

    // Add date filters to the query
    if (req.query.fromDate && req.query.toDate) {
      query.quotationDate = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else if (req.query.fromDate) {
      query.quotationDate = {
        $gte: startOfDay,
      };
    } else if (req.query.toDate) {
      query.quotationDate = {
        $lte: endOfDay,
      };
    }

    // Fetch the quotes based on the constructed query
    const quotes = await Quotation.find(query)
      .lean()
      .populate("createdBy", "username")
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get today's date for counting today's quotes
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalQuotes = await Quotation.countDocuments();
    const todayQuotes = await Quotation.countDocuments({
      createdAt: { $gte: today },
    });
    const approvedCount = await Quotation.countDocuments({ approved: true });
    const approvePending = await Quotation.countDocuments({
      approved: false,
    });
    const contractified = await Quotation.countDocuments({
      contractified: true,
    });
    res.status(200).json({
      message: "Quotations Retrieved",
      result: quotes,
      totalQuotes,
      todayQuotes,
      approvedCount,
      approvePending,
      contractified,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const singleQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quote = await Quotation.findById(id).populate("quoteInfo");
    if (!quote) {
      res.status(400).json({ message: "NO such Quotation" });
      return;
    }
    res.status(200).json({
      message: "",
      result: quote,
    });
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const quotationId = req.params.id;
    const { message, quote: updatedData } = req.body;
    const { quoteInfo, ...otherFields } = updatedData;
    const { reference } = otherFields;
    const referenceArray = String(reference).split(">.");
    otherFields.reference = referenceArray;
    const { _id, ...rest } = otherFields;

    const isapproved = await Quotation.isApproved(quotationId);
    if (isapproved) {
      const { _id, ...state } = await Quotation.findById(quotationId)
        .populate("quoteInfo")
        .populate({ path: "salesPerson", select: "-password" })
        .populate({ path: "createdBy", select: "-password" })
        .lean({ virtuals: ["subject"] });
      const author = req.user.id;
      rest.createdBy = req.user.id;
      rest.quotationDate = new Date();
      await createQuoteArchiveEntry(quotationId, state, author, message);
    }

    // Fetch the existing quotation document
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // Update the fields directly on the document
    Object.assign(quotation, rest);

    // Handle the reference array update
    quotation.reference = referenceArray;

    // Save the updated quotation
    await quotation.save();

    // Update or create quoteInfo documents
    const updatedQuoteInfoIds = [];
    for (const info of quoteInfo) {
      let quoteInfoDoc;
      if (info._id && isValidObjectId(info._id) && info._id.length !== 21) {
        quoteInfoDoc = await QuoteInfo.findByIdAndUpdate(info._id, info, {
          new: true,
          runValidators: true,
        });
      } else if (info?._id.length == 21) {
        const noIdInfo = remove_IdFromObj(info);
        quoteInfoDoc = new QuoteInfo(noIdInfo);
        await quoteInfoDoc.save();
      } else {
        //throw exception
      }
      updatedQuoteInfoIds.push(quoteInfoDoc._id);
    }
    if (!isapproved) {
      const { quoteInfo: oldIdArray } = await Quotation.findById(
        quotationId
      ).select("quoteInfo");

      // Convert IDs to strings for comparison
      const oldIdArrayStrings = oldIdArray.map((id) => id.toString());
      const updatedQuoteInfoIdsStrings = updatedQuoteInfoIds.map((id) =>
        id.toString()
      );

      const differenceIds = differenceBetweenArrays(
        oldIdArrayStrings,
        updatedQuoteInfoIdsStrings
      );

      if (differenceIds.length > 0) {
        await QuoteInfo.deleteMany({ _id: { $in: differenceIds } });
      }
    }

    // Update the quotation with the new quoteInfo ids
    quotation.quoteInfo = updatedQuoteInfoIds;
    await quotation.save();
    await quotation.reviseQuotationNo();

    // Fetch the updated quotation with populated quoteInfo
    const finalQuotation = await Quotation.findById(quotationId)
      .populate("quoteInfo")
      .populate("createdBy");
    res
      .status(200)
      .json({ message: "Quotation Updated", result: finalQuotation });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const docData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Quotation.findById(id)
      .populate("quoteInfo")
      .populate("salesPerson")
      .populate("createdBy")
      .lean({ virtuals: ["subject"] });
    res.status(200).json({
      message: "Nothing to say for now.",
      result: data,
    });
  } catch (error) {
    next(error);
  }
};
const approve = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Quotation.findByIdAndUpdate(id)
      .populate("quoteInfo")
      .populate("createdBy");
    if (data.approved) {
      res.status(404).json({ message: "Quotation Already approved" });
      return;
    }
    const author = req.user.id;
    await createQuoteArchiveEntry(id, data, author, "Approved");
    await data.approve();
    res.status(200).json({
      message: "Quotation Approved.",
      result: data,
    });
  } catch (error) {
    next(error);
  }
};
const getArchive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Quotation.findById(id)
      .populate("quoteInfo")
      .populate("salesPerson")
      .populate("createdBy")
      .populate({
        path: "archive",
        populate: { path: "revisions.author", model: "User" },
      })
      .lean({ virtuals: ["subject"] });
    res.status(200).json({
      message: "Nothing to say for now.",
      result: data,
    });
  } catch (error) {
    next(error);
  }
};
const similarProjects = async (req, res, next) => {
  try {
    const { clientName, projectName, workAreaType, workArea } = req.body;

    // Build the query object
    const query = {};
    if (clientName) {
      query["billToAddress.name"] = new RegExp(clientName, "i");
    }
    if (projectName) {
      query["shipToAddress.projectName"] = new RegExp(projectName, "i");
    }

    // Find quotations based on the query
    let quotations = await Quotation.find(query).populate("quoteInfo");

    // Filter quotations based on workAreaType and workArea
    if (workAreaType || workArea) {
      quotations = quotations.filter((quotation) => {
        return quotation.quoteInfo.some((info) => {
          let matchWorkAreaType = true;
          if (workAreaType) {
            matchWorkAreaType = new RegExp(workAreaType, "i").test(
              info.workAreaType
            );
          }

          let matchWorkArea = true;
          if (workArea) {
            const workAreaNum = parseFloat(info.workArea);
            const targetWorkArea = parseFloat(workArea);
            if (!isNaN(workAreaNum) && !isNaN(targetWorkArea)) {
              matchWorkArea = Math.abs(workAreaNum - targetWorkArea) <= 50;
            } else {
              matchWorkArea = false;
            }
          }

          // Both conditions must be true if both are present
          return matchWorkAreaType && matchWorkArea;
        });
      });
    }
    res.status(200).json(quotations);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export {
  create,
  quotes,
  singleQuote,
  docData,
  update,
  approve,
  getArchive,
  similarProjects,
};
