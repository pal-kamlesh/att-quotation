import {
  Badge,
  Button,
  FileInput,
  Modal,
  Select,
  Tabs,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import FileSection from "./FileSection";
import { useDispatch, useSelector } from "react-redux";
import { createCorrespondence } from "../redux/correspondence/correspondenceSlice";
import { unwrapResult } from "@reduxjs/toolkit";
const dummyFiles = [
  {
    publicId: "inward_123",
    type: "inward",
    title: "Client Purchase Order",
    date: "2024-03-15T08:00:00Z",
    category: "financial",
    description: "Initial purchase order from client",
    sender: {
      name: "John Clientman",
      organization: "ABC Corp",
      contact: {
        email: "john@abccorp.com",
        phone: "+1 234 567 890",
      },
    },
    url: "https://res.cloudinary.com/demo/invoice_123.pdf",
    originalName: "client_po.pdf",
  },
  {
    publicId: "outward_456",
    type: "outward",
    title: "Revised Quotation",
    date: "2024-03-16T09:30:00Z",
    category: "technical",
    description: "Updated technical specifications",
    sender: {
      name: "Jane Salesrep",
      organization: "Your Company",
      contact: {
        email: "jane@yourcompany.com",
        phone: "+1 987 654 321",
      },
    },
    url: "https://res.cloudinary.com/demo/quotation_v2.pdf",
    originalName: "quotation_rev2.pdf",
  },
];
const CorresponUI = ({ contractId, quotationId }) => {
  // const { inputData, fetching } = useSelector((state) => state.correspondence);
  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState(dummyFiles);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);
  const [inputData, setInputData] = useState({
    file: "",
    tags: "",
    sender: {
      name: "",
      designation: "",
      organization: "",
      contact: {
        email: "",
        phone: "",
      },
    },
    category: "",
    description: "",
    title: "",
    quotationId: quotationId ? quotationId : "",
    contractId: contractId ? contractId : "",
    direction: activeTab === 0 ? "inward" : "outward",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    setInputData((prev) => ({
      ...prev,
      direction: activeTab === 0 ? "inward" : "outward",
    }));
  }, [activeTab]);
  async function handleFileSubmit() {
    const result = await dispatch(createCorrespondence(inputData));
    const data = await unwrapResult(result);
    console.log(data);
  }
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setInputData((prev) => {
      const newState = { ...prev };
      let current = newState;

      // For file inputs, use the File object from files array
      if (type === "file") {
        current[name] = files[0];
        return newState;
      }

      // Split nested paths (e.g., "sender.contact.email")
      const keys = name.split(".");

      // Traverse nested keys (except last one)
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] };
      }

      // Handle arrays (e.g., tags, category)
      if (Array.isArray(current[keys.at(-1)])) {
        const lastKey = keys.at(-1);
        current[lastKey] = checked
          ? [...current[lastKey], value]
          : current[lastKey].filter((item) => item !== value);
      }
      // Handle regular fields
      else {
        current[keys.at(-1)] = type === "checkbox" ? checked : value;
      }

      return newState;
    });
  };

  console.log(inputData);
  return (
    <div>
      <div className="p-4 space-y-6 relative">
        <Tabs
          aria-label="Correspondence tabs"
          style="underline"
          onActiveTabChange={setActiveTab}
        >
          <Tabs.Item
            active
            title={
              <div className="flex items-center gap-2">
                <span>Inward Files</span>
                <Badge color="gray" className="ml-1">
                  {files.filter((f) => f.type === "inward").length}
                </Badge>
              </div>
            }
          >
            <FileSection type="inward" files={files} />
          </Tabs.Item>

          <Tabs.Item
            title={
              <div className="flex items-center gap-2">
                <span>Outward Files</span>
                <Badge color="gray" className="ml-1">
                  {files.filter((f) => f.type === "outward").length}
                </Badge>
              </div>
            }
          >
            <FileSection type="outward" files={files} />
          </Tabs.Item>
        </Tabs>
        <div className="flex justify-end absolute top-0 right-0">
          <Button onClick={() => setIsAddFileOpen(true)}>
            <HiOutlineUpload className="mr-2 h-5 w-5" />
            Add New File
          </Button>
        </div>
      </div>

      {/* Add File Modal */}
      <Modal
        show={isAddFileOpen}
        onClose={() => setIsAddFileOpen(false)}
        size="2xl"
      >
        <Modal.Header>
          Upload {activeTab === 0 ? "Inward" : "Outward"} File
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <FileInput
              id="file-upload"
              name="file"
              helperText="Upload PDF, DOC, or image files"
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                label="Title"
                name="title"
                placeholder="Document title"
                required
                onChange={handleChange}
              />
              <Select
                label="Category"
                name="category"
                value={inputData.category}
                onChange={handleChange}
              >
                <option selected={inputData.category === "legal"} value="legal">
                  Legal
                </option>
                <option
                  selected={inputData.category === "technical"}
                  value="technical"
                >
                  Technical
                </option>
                <option
                  selected={inputData.category === "financial"}
                  value="financial"
                >
                  Financial
                </option>
                <option
                  selected={inputData.category === "general"}
                  value="general"
                >
                  General
                </option>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Textarea
                label="Description"
                name="description"
                placeholder="Document description"
                value={inputData.description}
                onChange={handleChange}
              />
              <TextInput
                label="Tags"
                name="tags"
                placeholder="Comma saprated Tags"
                value={inputData.tags}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Sender Details
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput
                  name="sender.name"
                  placeholder="Sender name"
                  onChange={handleChange}
                />
                <TextInput
                  name="sender.organization"
                  value={inputData.organization}
                  placeholder="Organization"
                  onChange={handleChange}
                />
                <TextInput
                  name="sender.contact.email"
                  value={inputData.sender.contact.email}
                  placeholder="Email"
                  type="email"
                  onChange={handleChange}
                />
                <TextInput
                  name="sender.contact.phone"
                  value={inputData.sender.contact.phone}
                  placeholder="Phone number"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleFileSubmit}>Upload File</Button>
          <Button color="gray" onClick={() => setIsAddFileOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CorresponUI;
