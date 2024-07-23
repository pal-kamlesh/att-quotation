import {
  Quotation,
  QuoteArchive,
  QuoteInfo,
} from "../models/quotationModel.js";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  BorderStyle,
  Header,
  Footer,
} from "docx";
import fs from "fs/promises";
import path from "path";
import mongoose, { isValidObjectId, model } from "mongoose";
import libre from "libreoffice-convert";
import { promisify } from "util";

const convertAsync = promisify(libre.convert);

const toPdf = async (req, res, next) => {
  try {
    const __dirname = path.resolve();
    const inputPath = path.join(__dirname, "./temp/TicketNest.docx");
    const outputPath = path.join(__dirname, "./temp/output.pdf");
    const docxFile = await fs.readFile(inputPath);
    const pdfBuffer = await convertAsync(docxFile, ".pdf", undefined);
    await fs.writeFile(outputPath, pdfBuffer);
    res.status(200).json({ message: "check forlder" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
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

    res.status(200).json({
      message: "Quotations Retrieved",
      result: quotes,
      totalQuotes,
      todayQuotes,
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
      const archive = await createQuoteArchiveEntry(
        quotationId,
        state,
        author,
        message
      );
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
      } else if (info._id.length == 21) {
        const noIdInfo = remove_IdFromObj(info);
        quoteInfoDoc = new QuoteInfo(noIdInfo);
        console.log(quoteInfoDoc);
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

      console.log("old", oldIdArrayStrings);
      console.log("new", updatedQuoteInfoIdsStrings);
      const differenceIds = differenceBetweenArrays(
        oldIdArrayStrings,
        updatedQuoteInfoIdsStrings
      );
      console.log("difference", differenceIds);

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

async function createQuoteArchiveEntry(quoteId, state, author, message) {
  const theArchive = await QuoteArchive.findOne({ quotationId: quoteId });
  if (theArchive) {
    theArchive.revisions.push({ state, author, message });
    await theArchive.save();
  } else {
    const newArchive = new QuoteArchive({
      quotationId: quoteId,
      revisions: [{ state, author, message }],
    });
    await newArchive.save();
  }
}
function differenceBetweenArrays(A, B) {
  return A.filter((element) => !B.includes(element));
}
const docx = async (req, res, next) => {
  try {
    const __dirname = path.resolve();
    const outputPath = path.join(__dirname, "./temp/output.docx");
    // const data = {
    //   quotationNo: "EPPL/ATT/QTN/2023-001",
    //   quotationDate: {
    //     $date: {
    //       $numberLong: "1687305600000",
    //     },
    //   },
    //   kindAttentionPrefix: "Mr.",
    //   kindAttention: "Parag Datar",
    //   subject: "Quotation for Anti-Termite Treatment",
    //   reference: "Your enquiry and our discussion",
    //   treatmentType: "Anti-Termite Treatment",
    //   specification: "As per IS 6313 (Part 2):2013 & 2022",
    //   equipments:
    //     "Sprayers & Sprinklers will be used to ensure proper penetration of chemicals into the earth.",
    //   paymentTerms: "Within 15 days from the date of submission of bill.",
    //   taxation: "GST @ 18% As Applicable.",
    //   note: "1) (Before/After Raft)(At the Rate 5.0 Ltr/Per Sq.mt)\n2) (At the Rate 7.5 ltr/Per sq.mt)",
    //   quoteInfo: [
    //     {
    //       workAreaType: "Basement Area",
    //       workArea: "20,000",
    //       workAreaUnit: "Sq.ft",
    //       chemicalRate: "3.50",
    //       chemicalRateUnit: "Sq.ft",
    //       chemical: 'Imidachloprid 30.5% SC ("PREMISE" - By Bayer India/ENVU)',
    //     },
    //     {
    //       workAreaType: "Ground Floor",
    //       workArea: "15,000",
    //       workAreaUnit: "Sq.ft",
    //       chemicalRate: "3.75",
    //       chemicalRateUnit: "Sq.ft",
    //       chemical: 'Imidachloprid 30.5% SC ("PREMISE" - By Bayer India/ENVU)',
    //     },
    //     {
    //       workAreaType: "External Perimeter",
    //       workArea: "5,000",
    //       workAreaUnit: "Linear ft",
    //       chemicalRate: "4.00",
    //       chemicalRateUnit: "Linear ft",
    //       chemical: 'Imidachloprid 30.5% SC ("PREMISE" - By Bayer India/ENVU)',
    //     },
    //   ],
    //   billToAddress: {
    //     prefix: "Ms.",
    //     name: "Dhruva Woolen Mills Pvt. Ltd.",
    //     a1: "Runwal & Omkar Esquare,",
    //     a2: "5th floor,",
    //     a3: "Sion Trombay Road,",
    //     a4: "Sion (E),",
    //     a5: "Opp. Sion Chunabhatti Signal,",
    //     city: "Mumbai",
    //     pincode: "400022",
    //   },
    // };
    const data = await Quotation.findOne({
      quotationNo: "EPPL/ATT/QTN/4",
    })
      .populate("quoteInfo")
      .lean({ virtuals: ["subject"] });
    const quotationDoc = generateQuotation(data);

    const buffer = await Packer.toBuffer(quotationDoc);
    // Set the appropriate headers
    res.setHeader("Content-Disposition", "attachment; filename=Quotation.docx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    // Send the buffer as the response
    res.send(buffer);
  } catch (error) {
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
const removeIdFromDocuments = (documents) => {
  return documents.map(({ id, ...rest }) => rest);
};
const remove_IdFromObj = (obj) => {
  const { _id, ...rest } = obj;
  return rest;
};

function generateQuotation(data) {
  const doc = new Document({
    sections: [
      {
        headers: {
          default: new Header({
            children: [new Paragraph("Header text")],
          }),
        },
        footers: {
          default: new Footer({
            children: [new Paragraph("Footer text")],
          }),
        },
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Quotation Number: ${data.quotationNo}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${new Date(
                  data.quotationDate
                ).toLocaleDateString()}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Kind Attention: ${data.kindAttentionPrefix} ${data.kindAttention}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Subject: ${data.subject}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Reference: ${data.reference}` })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Treatment Type: ${data.treatmentType}` }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Specification: ${data.specification}` }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Equipments: ${data.equipments}` })],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Payment Terms: ${data.paymentTerms}` }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Taxation: ${data.taxation}` })],
          }),
          new Paragraph({
            children: [new TextRun({ text: `Note: ${data.note}` })],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun({ text: "Work Area Details:", bold: true })],
          }),
          createQuoteInfoTable(data.quoteInfo),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun(
                "We hope you will accept the same and will give us the opportunity to be of service to you."
              ),
            ],
          }),
          new Paragraph({
            children: [new TextRun("Please call us for clarification if any.")],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun("Thanking you,")],
          }),
          new Paragraph({
            children: [new TextRun("Yours Faithfully,")],
          }),
          new Paragraph({
            children: [new TextRun("For EXPRESS PESTICIDES PVT.LTD.")],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [new TextRun("Authorized Signatory")],
          }),
        ],
      },
    ],
  });

  return doc;
}
function createQuoteInfoTable(quoteInfo) {
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Work Area Type")] }),
          new TableCell({ children: [new Paragraph("Work Area")] }),
          new TableCell({ children: [new Paragraph("Chemical Rate")] }),
          new TableCell({ children: [new Paragraph("Chemical")] }),
        ],
      }),
      ...quoteInfo.map(
        (info) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(info.workAreaType)] }),
              new TableCell({
                children: [
                  new Paragraph(`${info.workArea} ${info.workAreaUnit}`),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph(
                    `${info.chemicalRate} ${info.chemicalRateUnit}`
                  ),
                ],
              }),
              new TableCell({ children: [new Paragraph(info.chemical)] }),
            ],
          })
      ),
    ],
  });

  return table;
}

export {
  create,
  quotes,
  docx,
  singleQuote,
  docData,
  update,
  approve,
  toPdf,
  getArchive,
};
