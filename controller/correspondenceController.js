import Correspondence from "../models/correspondenceModel.js";
import Quotation from "../models/quotationModel.js";
import Contract from "../models/contractModel.js";
import { cloudinaryService } from "../config/cloudinary.js";
// Helper function to validate parent document
const validateParentDocument = async (quotationId, contractId) => {
  if (quotationId) {
    const exists = await Quotation.exists({ _id: quotationId });
    return exists ? { parentField: "quotation", parentId: quotationId } : null;
  }
  if (contractId) {
    const exists = await Contract.exists({ _id: contractId });
    return exists ? { parentField: "contract", parentId: contractId } : null;
  }
  return null;
};

// Create or Update Correspondence
export const addFileToCorrespondence = async (req, res, next) => {
  try {
    const { quotationId, contractId, direction } = req.body;
    console.log(req.body);
    // Validate input
    if (!quotationId && !contractId) {
      return res
        .status(400)
        .json({ error: "Either quotationId or contractId is required" });
    }
    if (!["inward", "outward"].includes(direction)) {
      return res.status(400).json({ error: "Invalid direction" });
    }

    // Validate parent document exists
    const parent = await validateParentDocument(quotationId, contractId);
    if (!parent) {
      return res.status(404).json({ error: "Parent document not found" });
    }
    const data = await cloudinaryService.uploadDocument(
      req.file.buffer,
      quotationId ? quotationId : contractId,
      req.file.originalname
    );

    req.body.url = data.url;
    req.body.publicId = data.publicId;
    req.body.uploadedBy = req.user.username;
    console.log(req.body);
    // Find or create correspondence
    let correspondence = await Correspondence.findOne({
      [parent.parentField]: parent.parentId,
    });

    if (!correspondence) {
      correspondence = new Correspondence({
        [parent.parentField]: parent.parentId,
        [direction]: { files: [req.body] },
      });
    } else {
      correspondence[direction].files.push(req.body);
    }

    await correspondence.save();
    res.status(201).json(correspondence);
  } catch (error) {
    next(error);
  }
};

// Get Correspondence by Parent ID
export const getCorrespondence = async (req, res, next) => {
  try {
    const { quotationId, contractId } = req.params;

    const parent = await validateParentDocument(quotationId, contractId);
    if (!parent) {
      return res.status(404).json({ error: "Parent document not found" });
    }

    const correspondence = await Correspondence.findOne({
      [parent.parentField]: parent.parentId,
    });

    if (!correspondence) {
      return res.status(404).json({ error: "Correspondence not found" });
    }

    res.json(correspondence);
  } catch (error) {
    next(error);
  }
};

// Update File Metadata
export const updateFile = async (req, res, next) => {
  try {
    const { correspondenceId, direction, publicId } = req.params;
    const updateData = req.body;

    const result = await Correspondence.findOneAndUpdate(
      {
        _id: correspondenceId,
        [`${direction}.files.publicId`]: publicId,
      },
      {
        $set: {
          [`${direction}.files.$[elem].title`]: updateData.title,
          [`${direction}.files.$[elem].description`]: updateData.description,
          [`${direction}.files.$[elem].category`]: updateData.category,
          [`${direction}.files.$[elem].tags`]: updateData.tags,
        },
      },
      {
        arrayFilters: [{ "elem.publicId": publicId }],
        new: true,
      }
    );

    if (!result) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Delete File
export const deleteFile = async (req, res) => {
  try {
    const { correspondenceId, direction, publicId } = req.params;

    const result = await Correspondence.findOneAndUpdate(
      { _id: correspondenceId },
      {
        $pull: {
          [`${direction}.files`]: { publicId: publicId },
        },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Correspondence not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Entire Correspondence
export const deleteCorrespondence = async (req, res) => {
  try {
    const { correspondenceId } = req.params;
    const result = await Correspondence.findByIdAndDelete(correspondenceId);

    if (!result) {
      return res.status(404).json({ error: "Correspondence not found" });
    }

    res.json({ message: "Correspondence deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
