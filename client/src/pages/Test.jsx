import { useState } from "react";
import { Button } from "flowbite-react";
import headerImage from "../images/header.png";

const Test = ({ initialData = {} }) => {
  const [contract, setContract] = useState({
    contractNo: initialData.contractNo || "",
    contractDate: initialData.contractDate || "",
    workOrderNo: initialData.workOrderNo || "",
    workOrderDate: initialData.workOrderDate || "",
    billToAddress: {
      prefix: initialData.billToAddress?.prefix || "",
      name: initialData.billToAddress?.name || "",
      a1: initialData.billToAddress?.a1 || "",
      a2: initialData.billToAddress?.a2 || "",
      city: initialData.billToAddress?.city || "",
      pincode: initialData.billToAddress?.pincode || "",
      a5: initialData.billToAddress?.a5 || "",
      kci: initialData.billToAddress?.kci || [],
    },
    shipToAddress: {
      projectName: initialData.shipToAddress?.projectName || "",
      a1: initialData.shipToAddress?.a1 || "",
      a2: initialData.shipToAddress?.a2 || "",
      city: initialData.shipToAddress?.city || "",
      pincode: initialData.shipToAddress?.pincode || "",
      a5: initialData.shipToAddress?.a5 || "",
      kci: initialData.shipToAddress?.kci || [],
    },
    gstNo: initialData.gstNo || "",
    standard: initialData.standard || [],
    applySupply: initialData.applySupply || [],
    supply: initialData.supply || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContract((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, field, nestedField) => {
    const { name, value } = e.target;
    setContract((prev) => ({
      ...prev,
      [field]: { ...prev[field], [nestedField || name]: value },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto my-2 p-4 bg-white shadow-md rounded-lg">
      <div className="w-full flex items-center justify-center">
        <div className="font-sans p-4">
          <div className="text-center">
            <img
              src={headerImage}
              width="600"
              height="75"
              alt=""
              className="mx-auto w-full"
            />
          </div>
          <p className="text-center font-semibold text-lg mt-4 mb-4">
            PRE CONSTRUCTION ATT CONTRACT
          </p>
          <div className="border border-black w-full mb-1">
            <div className="flex">
              <div className="border-r border-black p-2 w-1/2">
                <p className="font-bold">CONTRACTEE INFORMATION</p>
                <input
                  type="text"
                  placeholder="Prefix"
                  value={contract.billToAddress.prefix}
                  onChange={(e) =>
                    handleNestedChange(e, "billToAddress", "prefix")
                  }
                  className="w-full border-b mt-2"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={contract.billToAddress.name}
                  onChange={(e) =>
                    handleNestedChange(e, "billToAddress", "name")
                  }
                  className="w-full border-b mt-2"
                />
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={contract.billToAddress.a1}
                  onChange={(e) => handleNestedChange(e, "billToAddress", "a1")}
                  className="w-full border-b mt-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={contract.billToAddress.city}
                  onChange={(e) =>
                    handleNestedChange(e, "billToAddress", "city")
                  }
                  className="w-full border-b mt-2"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={contract.billToAddress.pincode}
                  onChange={(e) =>
                    handleNestedChange(e, "billToAddress", "pincode")
                  }
                  className="w-full border-b mt-2"
                />
                <input
                  type="text"
                  placeholder="GST No."
                  value={contract.gstNo}
                  onChange={(e) => handleChange(e)}
                  className="w-full border-b mt-2"
                />
              </div>
              <div className="border-l border-black p-2 w-1/2">
                <label>
                  Contract No:
                  <input
                    type="text"
                    name="contractNo"
                    value={contract.contractNo}
                    onChange={handleChange}
                    className="w-full border-b mt-2"
                  />
                </label>
                <label>
                  Contract Date:
                  <input
                    type="date"
                    name="contractDate"
                    value={contract.contractDate}
                    onChange={handleChange}
                    className="w-full border-b mt-2"
                  />
                </label>
                <label>
                  Work Order No:
                  <input
                    type="text"
                    name="workOrderNo"
                    value={contract.workOrderNo}
                    onChange={handleChange}
                    className="w-full border-b mt-2"
                  />
                </label>
                <label>
                  Work Order Date:
                  <input
                    type="date"
                    name="workOrderDate"
                    value={contract.workOrderDate}
                    onChange={handleChange}
                    className="w-full border-b mt-2"
                  />
                </label>
              </div>
            </div>
          </div>
          {/* Additional input fields for other sections */}
          <div className="flex items-center justify-center mt-2">
            <Button gradientDuoTone="purpleToPink">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
