/* eslint-disable react/no-unescaped-entities */
import {
  Button,
  Label,
  Radio,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Loading from "./Loading";
import { toast } from "react-toastify";
import KCI from "./KCI";
import InputStandardAdv from "./InputStandardAdv";
import InputSupplyAdv from "./InputSupplyAdv";
import InputSupplyApplyAdv from "./InputSupplyApplyAdv";
import {
  getSingleContract,
  updateContract,
} from "../redux/contract/contractSlice";

// eslint-disable-next-line react/prop-types
function UpdateContract({ onClose, activeId = null }) {
  const { loading } = useSelector((state) => state.contract);
  const [contract, setContract] = useState({
    contractNo: "",
    salesPerson: "",
    billToAddress: {
      prefix: "",
      name: "",
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      city: "",
      pincode: "",
      kci: [],
    },
    shipToAddress: {
      projectName: "",
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      city: "",
      pincode: "",
      kci: [],
    },
    emailTo: "",
    note: "",
    docType: "standard",
    quoteInfo: [],
    workOrderNo: "",
    workOrderDate: new Date().toISOString().split("T")[0],
    gstNo: "",
  });
  const [doc, setDoc] = useState(contract?.docType);
  const [disableRadio, setDisableRadio] = useState(false);
  const [areaTypeModel, setAreaTypeModel] = useState(false);
  const dispatch = useDispatch();
  const { initials } = useSelector((state) => state.user);

  useEffect(() => {
    async function initial() {
      if (activeId) {
        try {
          const actionResult = await dispatch(getSingleContract(activeId));
          const result = unwrapResult(actionResult);
          console.log(result);

          // Use optional chaining and handle the case when workOrderDate is not present
          const isoDateStr = result.result?.workOrderDate ?? ""; // Default to empty string if not present

          // Only create a Date object if isoDateStr is a valid date string
          let formattedDate = "";
          if (isoDateStr) {
            const date = new Date(isoDateStr);
            if (!isNaN(date.getTime())) {
              // Check if the date is valid
              formattedDate = date.toISOString().split("T")[0];
            }
          }

          setContract({ ...result.result, workOrderDate: formattedDate });
          setDoc(result.result.docType);
        } catch (error) {
          console.error("Failed to fetch contract:", error);
        }
      }
    }

    initial();
  }, [activeId, dispatch]);

  function handleDocType(e) {
    if (contract.quoteInfo.length <= 0) {
      const { value } = e.target;
      setDoc(value);
    }
  }
  useEffect(() => {
    if (contract.quoteInfo.length <= 0) {
      setDisableRadio(false);
      setContract((prev) => ({ ...prev, docType: doc }));
    } else {
      setDisableRadio(true);
      setContract((prev) => ({ ...prev, docType: doc }));
    }
  }, [doc, contract?.quoteInfo.length]);
  function handleContractChange(e) {
    const { name, value } = e.target;
    setContract((prev) => ({ ...prev, [name]: value }));
  }
  function handleAddress(e) {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    // Check if the input is for billToAddress or shipToAddress
    const isForBillToAddress = nameParts[0] === "billToAddress";
    const isForShipToAddress = nameParts[0] === "shipToAddress";

    if (isForBillToAddress || isForShipToAddress) {
      const addressType = isForBillToAddress
        ? "billToAddress"
        : "shipToAddress";
      const fieldName = nameParts[1];

      setContract((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          [fieldName]: value,
        },
      }));
    } else {
      setContract((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }
  function duplicateBillToShipTo() {
    const { billToAddress } = contract;
    const { shipToAddress } = contract;

    // Create an object to hold the duplicated fields
    const updatedShipToAddress = {};

    // Loop through billToAddress keys and copy only those present in shipToAddress
    Object.keys(billToAddress).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(shipToAddress, key)) {
        updatedShipToAddress[key] = billToAddress[key];
      }
    });

    // Update the shipToAddress in the state
    setContract({
      ...contract,
      shipToAddress: { ...shipToAddress, ...updatedShipToAddress },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      contract.billToAddress.name === "" ||
      contract.billToAddress.a1 === "" ||
      contract.billToAddress.a2 === "" ||
      contract.billToAddress.a3 === "" ||
      contract.billToAddress.a4 === "" ||
      contract.billToAddress.a5 === "" ||
      contract.billToAddress.city === "" ||
      contract.shipToAddress.name === "" ||
      contract.shipToAddress.a1 === "" ||
      contract.shipToAddress.pincode === "" ||
      contract.shipToAddress.a2 === "" ||
      contract.shipToAddress.a3 === "" ||
      contract.shipToAddress.a4 === "" ||
      contract.shipToAddress.a5 === "" ||
      contract.shipToAddress.city === "" ||
      contract.shipToAddress.pincode === ""
    ) {
      toast.error("BillTo/ShipTo Information is incomplete!");
      return;
    }
    if (contract.salesPerson === "") {
      toast.error("Please select salesPerson!");
      return;
    }
    if (contract.quoteInfo.length <= 0) {
      toast.error("Please fill the number details.");
      return;
    }

    const data = { contract, id: activeId };
    const actionResult = await dispatch(updateContract(data));
    await unwrapResult(actionResult);
    onClose();
  }
  console.log(contract);
  return (
    <div>
      {loading ? <Loading /> : null}
      <form className="">
        <div className="flex items-center justify-evenly gap-4 mb-4 flex-wrap">
          <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="contractNo" value="Contract No" />
            </div>
            <TextInput
              name="contractNo"
              value={contract?.contractNo}
              onChange={handleContractChange}
            />
          </div>
          <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="workOrderNo" value="Work Order No" />
            </div>
            <TextInput
              name="workOrderNo"
              type="number"
              value={contract?.workOrderNo}
              onChange={handleContractChange}
            />
          </div>
          <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="workOrderDate" value="Work Order Date" />
            </div>
            <input
              name="workOrderDate"
              type="date"
              value={contract?.workOrderDate}
              onChange={handleContractChange}
            />
          </div>
          <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="salesPerson">
                <span>Sale Person: </span>
                <span className=" text-red-500">*</span>
              </Label>
            </div>
            <Select name="salesPerson" onChange={handleContractChange}>
              <option></option>
              {initials.length > 0 &&
                initials.map((initial) => (
                  <option
                    selected={contract?.salesPerson === initial._id}
                    key={initial._id}
                    value={initial._id}
                  >
                    {initial.initials} {initial.username}
                  </option>
                ))}
            </Select>
          </div>
          <div className="col-span-5">
            <div className="mb-2 block">
              <Label htmlFor="emailTo">
                <span>Email To: </span>
              </Label>
            </div>
            <TextInput
              type="email"
              name="emailTo"
              onChange={handleContractChange}
              value={contract?.emailTo}
            />
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          <Button
            outline
            gradientMonochrome="cyan"
            onClick={duplicateBillToShipTo}
          >
            Copy BillTo/ShipTo
          </Button>
        </div>
        <div className="grid grid-cols-8 gap-4 border mb-4 rounded-md">
          <div className=" p-4 col-span-4">
            <h2>Bill To Address</h2>
            <div className="max-w-full grid grid-cols-6">
              <div className="col-span-1">
                <div className="mb-2">
                  <Label htmlFor="billToAddress.prefix" value="Prefix" />
                </div>
                <Select name="billToAddress.prefix" onChange={handleAddress}>
                  <option></option>
                  <option
                    selected={contract?.billToAddress.prefix === "M/s."}
                    value="M/s."
                  >
                    M/s.
                  </option>
                  <option
                    selected={contract?.billToAddress.prefix === "Mr."}
                    value="Mr."
                  >
                    Mr.
                  </option>
                  <option
                    selected={contract.billToAddress.prefix === "Mrs."}
                    value="Mrs."
                  >
                    Mrs.
                  </option>
                </Select>
              </div>
              <div className=" col-span-5">
                <div className="mb-2">
                  <Label htmlFor="billToAddress.name">
                    <span>Name</span>
                    <span className="text-red-500">*</span>
                  </Label>
                </div>
                <TextInput
                  type="text"
                  name="billToAddress.name"
                  value={contract?.billToAddress.name}
                  onChange={handleAddress}
                />
              </div>
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="a1">
                  <span>A1</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="billToAddress.a1"
                onChange={handleAddress}
                value={contract?.billToAddress.a1}
                placeholder="Building/Office name"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="a2">
                  <span>A2</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="billToAddress.a2"
                onChange={handleAddress}
                value={contract?.billToAddress.a2}
                placeholder="Flat/Office No"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="a3">
                  <span>A3</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="billToAddress.a3"
                onChange={handleAddress}
                value={contract?.billToAddress.a3}
                placeholder="Road/Lanename"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="a4">
                  <span>A4</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="billToAddress.a4"
                onChange={handleAddress}
                value={contract?.billToAddress.a4}
                placeholder="Location"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="a5">
                  <span>A5</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="billToAddress.a5"
                onChange={handleAddress}
                value={contract?.billToAddress.a5}
                placeholder="NearBy: Landmark"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="billToAddress.city">
                  <span>City</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="billToAddress.city"
                value={contract?.billToAddress.city}
                onChange={handleAddress}
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="billToAddress.pincode">
                  <span>Pincode: </span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="billToAddress.pincode"
                onChange={handleAddress}
                value={contract?.billToAddress.pincode}
              />
            </div>

            <KCI
              quote={contract}
              setQuote={setContract}
              addressKey="billToAddress"
            />
          </div>
          <div className="p-4 col-span-4">
            <h3>Ship To Address</h3>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="shipToAddress.projectName">
                  <span>Project Name</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="shipToAddress.projectName"
                onChange={handleAddress}
                value={contract?.shipToAddress.projectName}
                type="text"
              />
            </div>

            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="shipToAddress.a1">
                  <span>A1</span>
                  <span className=" text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="shipToAddress.a1"
                onChange={handleAddress}
                value={contract?.shipToAddress.a1}
                placeholder="Building/Office name"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="shipToAddress.a2">
                  <span>A2</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="shipToAddress.a2"
                onChange={handleAddress}
                value={contract?.shipToAddress.a2}
                placeholder="Flat/Office No"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="shipToAddress.a3">
                  <span>A3</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="shipToAddress.a3"
                onChange={handleAddress}
                value={contract.shipToAddress.a3}
                placeholder="Road/Lanename"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="shipToAddress.a4">
                  <span>A4</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="shipToAddress.a4"
                onChange={handleAddress}
                value={contract.shipToAddress.a4}
                placeholder="Location"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="shipToAddress.a5">
                  <span>A5</span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="shipToAddress.a5"
                onChange={handleAddress}
                value={contract.shipToAddress.a5}
                placeholder="NearBy: Landmark"
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <span>City</span>
                <span className="text-red-500">*</span>
              </div>
              <TextInput
                name="shipToAddress.city"
                value={contract.shipToAddress.city}
                onChange={handleAddress}
              />
            </div>
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="shipToAddress.pincode">
                  <span>Pincode: </span>
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="shipToAddress.pincode"
                value={contract.shipToAddress.pincode}
                onChange={handleAddress}
              />
            </div>
            <KCI
              quote={contract}
              setQuote={setContract}
              addressKey="shipToAddress"
            />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-4 gap-4 mb-4">
            <div className="max-w-full">
              <div className="mb-2 block">
                <Label htmlFor="gstNo" value="GST No" />
              </div>
              <TextInput
                name="gstNo"
                value={contract.gstNo}
                onChange={handleContractChange}
              />
            </div>
          </div>
          <div className=" col-span-4 gap-4 mb-4 ">
            <div className="col-span-4 p-1">
              <div className="col-span-2">
                <fieldset className="flex gap-4 w-full justify-evenly">
                  <legend className="mb-4">Choose doc type</legend>
                  <div className="flex gap-2">
                    <Radio
                      id="united-state"
                      name="docType"
                      value="standard"
                      checked={
                        doc === "" || contract.docType === "standard"
                          ? true
                          : false
                      }
                      disabled={disableRadio}
                      onChange={(e) => handleDocType(e)}
                      className="text-bg-green-500 focus:ring-green-500 checked:bg-green-500"
                    />
                    <Label htmlFor="united-state">Standard</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="supply"
                      name="docType"
                      value="supply"
                      disabled={disableRadio}
                      checked={doc === "supply" ? true : false}
                      onChange={(e) => handleDocType(e)}
                      className="text-yellow-400 focus:ring-yellow-400 checked:bg-yellow-400"
                    />
                    <Label htmlFor="supply">Supply</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="supply/apply"
                      name="docType"
                      value="supply/apply"
                      disabled={disableRadio}
                      checked={doc === "supply/apply" ? true : false}
                      onChange={(e) => handleDocType(e)}
                      className="text-blue-500 focus:ring-blue-500 checked:bg-blue-500"
                    />
                    <Label htmlFor="supply/apply">Supply/Apply</Label>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>

        {doc === "standard" && (
          <InputStandardAdv quote={contract} setQuote={setContract} />
        )}

        {doc === "supply" && (
          <InputSupplyAdv quote={contract} setQuote={setContract} />
        )}
        {doc === "supply/apply" && (
          <InputSupplyApplyAdv quote={contract} setQuote={setContract} />
        )}
        <div className="col-span-1 mb-4">
          <Label>Notes: </Label>
          <Textarea
            name="note"
            onChange={handleContractChange}
            value={contract.note}
          />
        </div>
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
      <CustomModal
        isOpen={areaTypeModel}
        onClose={() => setAreaTypeModel(!areaTypeModel)}
        heading="New Work Area Type"
      >
        <h1>Hey Hey!</h1>
      </CustomModal>
    </div>
  );
}

export default UpdateContract;
