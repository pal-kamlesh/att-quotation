import {
  Badge,
  Button,
  Card,
  FileInput,
  Modal,
  Select,
  Tabs,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { HiEye, HiTrash, HiOutlineUpload } from "react-icons/hi";
import FileSection from "./FileSection";
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
const CorresponUI = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [files, setFiles] = useState(dummyFiles);
  const [isAddFileOpen, setIsAddFileOpen] = useState(false);

  function handlePreview(file) {
    window.open(file.url, "_blank");
  }
  function handleDelete(file) {
    setFiles(files.filter((f) => f.publicId !== file.publicId));
  }
  function handleFileUpload() {}
  function handleFileSubmit() {}
  function onAddFile() {}
  return (
    <div>
      <div className="p-4 space-y-6">
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
            <FileSection type="inward" files={files} onAddFile={onAddFile} />
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
            <FileSection type="outward" files={files} onAddFile={onAddFile} />
          </Tabs.Item>
        </Tabs>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                    {file.title}
                  </h5>
                  <span className="text-sm text-gray-500">{file.date}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="xs" onClick={() => handlePreview(file)}>
                    <HiEye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => handleDelete(file)}
                  >
                    <HiTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Badge color={file.category === "legal" ? "purple" : "info"}>
                  {file.category}
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {file.description}
                </p>
                <div className="text-sm">
                  <p className="font-medium">From: {file.sender.name}</p>
                  <p className="text-gray-500">{file.sender.organization}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-end">
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
              helperText="Upload PDF, DOC, or image files"
              onChange={handleFileUpload}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput label="Title" placeholder="Document title" required />
              <Select label="Category" defaultValue="general">
                <option value="legal">Legal</option>
                <option value="technical">Technical</option>
                <option value="financial">Financial</option>
                <option value="general">General</option>
              </Select>
            </div>

            <TextInput
              label="Description"
              placeholder="Document description"
              helperText="Optional description for the file"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Sender Details
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextInput placeholder="Sender name" />
                <TextInput placeholder="Organization" />
                <TextInput placeholder="Email" type="email" />
                <TextInput placeholder="Phone number" />
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
