import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";

//Genereated using AI
class CloudinaryService {
  constructor() {
    dotenv.config();
    const requiredEnvVars = ["CLOUD_NAME", "CLOUD_KEY", "CLOUD_SECRET"];
    this.validateEnvironmentVariables(requiredEnvVars);

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
  }

  validateEnvironmentVariables(required) {
    const missing = required.filter((var_name) => !process.env[var_name]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }

  /**
   * Uploads a document to Cloudinary
   * @param {string} filePath - Path to the file to upload
   * @param {string} id - Unique identifier for the quotation
   * @param {Object} options - Additional upload options
   * @returns {Promise<string>} - The secure URL of the uploaded document
   */

  async uploadDocument(input, id, fileName) {
    try {
      // Determine folder based on file extension
      const fileExtension = fileName.split(".").pop().toLowerCase();
      const folder = fileExtension === "docx" ? "att/docx" : "att/files";

      // Create full public ID with folder structure
      const baseName = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
      const publicId = `${folder}/${id}/${baseName}`;

      const uploadOptions = {
        resource_type: "auto",
        public_id: publicId,
        overwrite: true,
        filename_override: fileName, // Preserve original filename in Cloudinary
        use_filename: true,
      };

      let response;

      if (Buffer.isBuffer(input)) {
        // Buffer upload with stream
        const stream = Readable.from(input);
        response = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.pipe(uploadStream);
        });
      } else {
        // File path upload
        response = await cloudinary.uploader.upload(input, uploadOptions);
      }

      return {
        url: response.secure_url,
        publicId: response.public_id,
        format: response.format,
        size: response.bytes,
        createdAt: response.created_at,
        fullPath: `${response.public_id}.${response.format}`, // Full path with extension
      };
    } catch (error) {
      console.log(error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /**
   * Deletes a document from Cloudinary
   * @param {string} publicId - Public ID of the document to delete
   * @returns {Promise<Object>} - Deletion response
   */
  async deleteDocument(publicId) {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    try {
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
        invalidate: true,
      });

      if (response.result !== "ok") {
        throw new Error(`Deletion failed: ${response.result}`);
      }

      return {
        success: true,
        publicId,
        result: response.result,
      };
    } catch (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  /**
   * Extracts the public ID from a Cloudinary URL
   * @param {string} cloudinaryUrl - The Cloudinary URL
   * @returns {string} - The extracted public ID
   */
  extractPublicId(cloudinaryUrl) {
    if (!cloudinaryUrl || typeof cloudinaryUrl !== "string") {
      throw new Error("Valid Cloudinary URL is required");
    }

    try {
      const urlPattern = /\/v\d+\/(.+?)\.\w+$/;
      const match = cloudinaryUrl.match(urlPattern);

      if (!match) {
        throw new Error("Invalid Cloudinary URL format");
      }

      return match[1];
    } catch (error) {
      throw new Error(`Failed to extract public ID: ${error.message}`);
    }
  }

  /**
   * Gets information about a document
   * @param {string} publicId - Public ID of the document
   * @returns {Promise<Object>} - Document information
   */
  async getDocumentInfo(publicId) {
    if (!publicId) {
      throw new Error("Public ID is required");
    }

    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: "raw",
      });

      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        size: result.bytes,
        createdAt: result.created_at,
        tags: result.tags,
      };
    } catch (error) {
      throw new Error(`Failed to get document info: ${error.message}`);
    }
  }
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();

// Also export class for testing or multiple instances
export { CloudinaryService };
