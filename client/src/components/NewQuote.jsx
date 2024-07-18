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
import { MdDelete } from "react-icons/md";
import CustomModal from "./CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { createQuote } from "../redux/quote/quoteSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Loading from "./Loading";
import { toast } from "react-toastify";
import InputSupplyApply from "./InputSupplyApply";
import InputSupply from "./InputSupply";
import InputStandard from "./InputStandard";
import KCI from "./KCI";

// eslint-disable-next-line react/prop-types
function NewQuote({ onClose }) {
  const getInitialQuoteState = () => {
    const savedData = localStorage.getItem("newQuote");
    if (savedData) {
      const { quote } = JSON.parse(savedData);
      return quote;
    }
    return {
      quotationDate: new Date().toISOString().split("T")[0],
      kindAttention: "",
      kindAttentionPrefix: "",
      reference: "",
      salePerson: "",
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
      specification: "",
      emailTo: "",
      note: "",
      quotationNo: "EPPL/ATT/QTN/",
    };
  };

  const getInitialInfoArrayState = () => {
    const savedData = localStorage.getItem("newQuote");
    if (savedData) {
      const { infoArray } = JSON.parse(savedData);
      return infoArray;
    }
    return [];
  };
  const { loading } = useSelector((state) => state.quote);
  const [infoObj, setInfoObj] = useState({
    workAreaType: "",
    workArea: "",
    workAreaUnit: "",
    chemicalRate: "",
    chemicalRateUnit: "",
    serviceRate: "",
    serviceRateUnit: "",
    chemical: "",
    chemicalQuantity: "",
    applyRate: "",
    applyRateUnit: "",
  });
  const [quote, setQuote] = useState(getInitialQuoteState());
  const [subRef, setSubRef] = useState("");
  const [infoArray, setInfoArray] = useState(getInitialInfoArrayState());
  const [types, setTypes] = useState([]);
  const [docType, setDocType] = useState("standard");
  const [areaTypeModel, setAreaTypeModel] = useState(false);
  const dispatch = useDispatch();
  const { initials } = useSelector((state) => state.user);

  useEffect(() => {
    const words = infoObj.workAreaType.split("+");
    if (words.length === 1 && words[0] === "") return;
    setTypes(words);
  }, [infoObj.workAreaType]);

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("newQuote");
    if (savedData) {
      const { quote, infoArray } = JSON.parse(savedData);
      setQuote(quote);
      setInfoArray(infoArray);
    }
  }, []);

  // Save data to local storage whenever quote or infoArray changes
  useEffect(() => {
    localStorage.setItem("newQuote", JSON.stringify({ quote, infoArray }));
  }, [quote, infoArray]);

  function handleInfoChange(e) {
    const { name, value } = e.target;
    if (name === "chemicalRateUnit" && docType === "supply/apply") {
      let applyRateU = value === "Lumpsum" ? "Lumpsum" : null;
      setInfoObj((prev) => ({
        ...prev,
        [name]: value,
        applyRateUnit: applyRateU,
      }));
      return;
    }
    if (name === "workAreaUnit" && docType === "standard") {
      let serviceRateU =
        value === "Sq.fts"
          ? "Per Sq.ft"
          : value === "Sq.mts"
          ? "Per Sq.mt"
          : value === "R.fts"
          ? "Per R.ft"
          : value === "R.mts"
          ? "Per R.mt"
          : null;
      setInfoObj((prev) => ({
        ...prev,
        [name]: value,
        serviceRateUnit: serviceRateU,
      }));
      return;
    }
    if (name === "workAreaUnit" && docType === "standard") {
      let applyRateU =
        value === "Sq.fts"
          ? "Per Sq.ft"
          : value === "Sq.mts"
          ? "Per Sq.mt"
          : value === "R.fts"
          ? "Per R.ft"
          : value === "R.mts"
          ? "Per R.mt"
          : value === "Lumpsum"
          ? "Lumpsum"
          : null;
      setInfoObj((prev) => ({
        ...prev,
        [name]: value,
        applyRateUnit: applyRateU,
      }));
      return;
    }
    setInfoObj((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function convertToFloatingPoint(number) {
    let floatingPointNumber = Number(number).toFixed(2);
    return floatingPointNumber;
  }
  function handleMoreInfo() {
    if (docType === "standard") {
      if (
        infoObj.workArea === "" ||
        infoObj.workAreaUnit === "" ||
        infoObj.serviceRate === "" ||
        infoObj.serviceRateUnit === "" ||
        infoObj.chemical === ""
      ) {
        toast.error("Work Area Type Information is incomplete.");
        return;
      }
    }

    const workAreaFormted = Number(infoObj.workArea).toLocaleString("en-IN");
    let chemicalQuantityFormated = null;
    if (
      infoObj.chemicalQuantity === "" ||
      infoObj.chemicalQuantity === null ||
      infoObj.chemicalQuantity === undefined
    ) {
      chemicalQuantityFormated = null;
    } else {
      chemicalQuantityFormated = Number(
        infoObj.chemicalQuantity
      ).toLocaleString("en-IN");
    }
    let chemicalRateFormated = null;
    if (
      infoObj.chemicalRate === "" ||
      infoObj.chemicalRate === null ||
      infoObj.chemicalRate === undefined
    ) {
      chemicalRateFormated = null;
      infoObj.chemicalRateUnit = null;
    } else {
      chemicalRateFormated = convertToFloatingPoint(infoObj.chemicalRate);
    }
    let serviceRateFormated = null;
    if (infoObj.serviceRate === "" || infoObj.serviceRate === null) {
      serviceRateFormated = null;
      infoObj.serviceRateUnit = null;
    } else {
      serviceRateFormated = convertToFloatingPoint(infoObj.serviceRate);
    }
    let applyRateFormated = null;
    if (infoObj.applyRate === "" || infoObj.applyRate === null) {
      applyRateFormated = null;
      infoObj.applyRateUnit = null;
    } else {
      applyRateFormated = infoObj.applyRate;
    }

    const infoDup = new Object(infoObj);
    infoDup.workArea = workAreaFormted;
    infoDup.chemicalRate = chemicalRateFormated;
    infoDup.serviceRate = serviceRateFormated;
    infoDup.chemicalQuantity = chemicalQuantityFormated;
    infoDup.chemicalRate = chemicalRateFormated;
    infoObj.applyRate = applyRateFormated;
    setInfoArray((prev) => [...prev, infoDup]);
    setInfoObj({
      workAreaType: "",
      workArea: "",
      workAreaUnit: "",
      chemicalRate: "",
      chemicalRateUnit: "",
      serviceRate: "",
      serviceRateUnit: "",
      chemical: "",
    });
    setTypes([]);
  }

  function handleDeleteInfo(workAreaType) {
    setInfoArray((prev) =>
      prev.filter((info) => info.workAreaType !== workAreaType)
    );
  }
  function handleQuoteChange(e) {
    const { name, value } = e.target;
    if (name === "kindAttentionPrefix" && value === "NA") {
      setQuote((prev) => ({ ...prev, kindAttention: "NA", [name]: value }));
      return;
    }
    setQuote((prev) => ({ ...prev, [name]: value }));
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

      setQuote((prev) => ({
        ...prev,
        [addressType]: {
          ...prev[addressType],
          [fieldName]: value,
        },
      }));
    } else {
      setQuote((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }
  function duplicateBillToShipTo() {
    const { billToAddress } = quote;
    const { shipToAddress } = quote;

    // Create an object to hold the duplicated fields
    const updatedShipToAddress = {};

    // Loop through billToAddress keys and copy only those present in shipToAddress
    Object.keys(billToAddress).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(shipToAddress, key)) {
        updatedShipToAddress[key] = billToAddress[key];
      }
    });

    // Update the shipToAddress in the state
    setQuote({
      ...quote,
      shipToAddress: { ...shipToAddress, ...updatedShipToAddress },
    });
  }
  // function dummyQuote() {
  //   const data = {
  //     quote: {
  //       billToAddress: {
  //         prefix: "M/s.",
  //         name: "KEC International Ltd.",
  //         a1: "Raghuram Heights",
  //         a2: "463",
  //         a3: "Dr Annie Besant Raod",
  //         a4: "Worli",
  //         a5: "Opposite Hell",
  //         city: "Mumbai",
  //         pincode: "400030",
  //         kci: [],
  //       },
  //       shipToAddress: {
  //         projectName: "Prestige City Rehab Project",
  //         a1: "Raghuram Heights",
  //         a2: "463",
  //         a3: "Dr Annie Besant Raod",
  //         a4: "Worli",
  //         a5: "Opposite Hell",
  //         city: "Mumbai",
  //         pincode: "400030",
  //         kci: [],
  //       },
  //       kindAttentionPrefix: "Mr.",
  //       kindAttention: "Malahari Naik",
  //       reference: "Our earlier quotation No EPPL/ATT/QTN/401",
  //       specification: "As per IS 6313 (Part 2):2013",
  //       note: "",
  //     },
  //     quoteInfo: [
  //       {
  //         workAreaType: "Basement Area",
  //         workArea: "6,696",
  //         workAreaUnit: "Sq.mts",
  //         chemicalRate: null,
  //         chemicalRateUnit: null,
  //         serviceRate: "27.00",
  //         serviceRateUnit: "Per Sq.mt",
  //         applyRate: null,
  //         applyRateUnit: null,
  //         chemical: "Imidachloprid 30.5% SC",
  //         chemicalQuantity: null,
  //       },
  //       {
  //         workAreaType: "Basement Area",
  //         workArea: "66,967",
  //         workAreaUnit: "Sq.mts",
  //         chemicalRate: "12.00",
  //         chemicalRateUnit: "Per Ltr.",
  //         serviceRate: null,
  //         serviceRateUnit: null,
  //         applyRate: "13",
  //         applyRateUnit: "Per Sq.mt",
  //         chemical: "Imidachloprid 30.5% SC",
  //         chemicalQuantity: "201",
  //       },
  //     ],
  //   };
  //   setQuote(data.quote);
  //   setInfoArray(data.quoteInfo);
  // }
  function handleSubRef(e) {
    const { value } = e.target;
    setSubRef(value);
    if (quote.reference === "" || quote.reference === " ") {
      setQuote((prev) => ({ ...prev, reference: value }));
    } else {
      setQuote((prev) => ({
        ...prev,
        reference: ` ${prev.reference}>. ${value}`,
      }));
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (
      quote.billToAddress.name === "" ||
      quote.billToAddress.a1 === "" ||
      quote.billToAddress.a2 === "" ||
      quote.billToAddress.a3 === "" ||
      quote.billToAddress.a4 === "" ||
      quote.billToAddress.a5 === "" ||
      quote.billToAddress.city === "" ||
      quote.shipToAddress.name === "" ||
      quote.shipToAddress.a1 === "" ||
      quote.shipToAddress.pincode === "" ||
      quote.shipToAddress.a2 === "" ||
      quote.shipToAddress.a3 === "" ||
      quote.shipToAddress.a4 === "" ||
      quote.shipToAddress.a5 === "" ||
      quote.shipToAddress.city === "" ||
      quote.shipToAddress.pincode === ""
    ) {
      toast.error("BillTo/ShipTo Information is incomplete!");
      return;
    }
    if (quote.reference === "") {
      toast.error("Please enter Reference!");
      return;
    }
    if (quote.specification === "") {
      toast.error("Please enter Specification!");
      return;
    }
    if (quote.salePerson === "") {
      toast.error("Please select salePerson!");
      return;
    }
    if (infoArray.length <= 0) {
      toast.error("Please fill the number details.");
      return;
    }
    if (quote.kindAttention === "" || quote.kindAttentionPrefix === "") {
      toast.error("Please enter Kind Attn: value!");
      return;
    }
    const data = { quote, infoArray };
    const actionResult = await dispatch(createQuote(data));
    const result = await unwrapResult(actionResult);
    if (result.message === "Quotation Created!") {
      localStorage.removeItem("newQuote");
    }
    onClose();
  }
  return (
    <div>
      {loading ? <Loading /> : null}
      <form className="">
        <div className="flex items-center justify-evenly gap-4 mb-4 flex-wrap">
          <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="quotationDate" value="Quotation Date" />
            </div>
            <input
              name="quotationDate"
              type="date"
              value={quote.quotationDate}
              onChange={handleQuoteChange}
            />
          </div>
          <div className="max-w-full grid grid-cols-6">
            <div className="col-span-1">
              <div className="mb-2 ">
                <Label htmlFor="kindAttentionPrefix">
                  <span>Prefix</span>
                  <span className=" text-red-500">*</span>
                </Label>
              </div>
              <Select
                name="kindAttentionPrefix"
                value={quote.kindAttentionPrefix}
                onChange={handleQuoteChange}
              >
                <option></option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="NA">NA</option>
              </Select>
            </div>
            <div className="col-span-5">
              <div className="mb-2 block">
                <Label htmlFor="kindAttention">
                  <span>Kind Attn: </span>
                  <span className=" text-red-500">*</span>
                </Label>
              </div>
              <TextInput
                name="kindAttention"
                onChange={handleQuoteChange}
                value={quote.kindAttention}
              />
            </div>
          </div>
          <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="salePerson">
                <span>Sale Person: </span>
                <span className=" text-red-500">*</span>
              </Label>
            </div>
            <Select name="salePerson" onChange={handleQuoteChange}>
              <option></option>
              {initials.length > 0 &&
                initials.map((initial) => (
                  <option value={initial._id} key={initial._id}>
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
              onChange={handleQuoteChange}
              value={quote.emailTo}
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
          {/* <Button outline gradientMonochrome="cyan" onClick={dummyQuote}>
            Dummy Quote
          </Button> */}
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
                  <option value="M/s.">M/s.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
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
                  value={quote.billToAddress.name}
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
                value={quote.billToAddress.a1}
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
                value={quote.billToAddress.a2}
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
                value={quote.billToAddress.a3}
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
                value={quote.billToAddress.a4}
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
                value={quote.billToAddress.a5}
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
                value={quote.billToAddress.city}
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
                value={quote.billToAddress.pincode}
              />
            </div>

            <KCI quote={quote} setQuote={setQuote} addressKey="billToAddress" />
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
                value={quote.shipToAddress.projectName}
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
                value={quote.shipToAddress.a1}
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
                value={quote.shipToAddress.a2}
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
                value={quote.shipToAddress.a3}
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
                value={quote.shipToAddress.a4}
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
                value={quote.shipToAddress.a5}
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
                value={quote.shipToAddress.city}
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
                value={quote.shipToAddress.pincode}
                onChange={handleAddress}
              />
            </div>
            <KCI quote={quote} setQuote={setQuote} addressKey="shipToAddress" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="max-w-full border p-1">
            <div className="mb-2 block">
              <Label htmlFor="reference" className="grid grid-cols-12">
                <span className=" col-span-2">
                  Ref: <span className="text-red-500">*</span>
                </span>
                <Select
                  name="subRef"
                  onChange={handleSubRef}
                  className="col-span-9"
                  value={subRef}
                >
                  <option></option>
                  <option>Your enquiry & our discussion had with ____</option>
                  <option>Your email enquiry Dated **/**/**</option>
                  <option>Your email enquiry from _____ Dated **/**/**</option>
                  <option>Your enquiry & our discussion had with </option>
                </Select>
                <div className="col-span-1 flex items-center justify-end">
                  <Button
                    onClick={() => setAreaTypeModel(true)}
                    gradientDuoTone="tealToLime"
                    size="xs"
                    className=" col-span-1"
                  >
                    +
                  </Button>
                </div>
              </Label>
            </div>
            <TextInput
              name="reference"
              onChange={handleQuoteChange}
              value={quote.reference}
              placeholder="Reference"
            />
          </div>
          <div className="max-w-full">
            <div className="mb-2 block">
              <Label htmlFor="specification" value="Specification">
                <span>Specification</span>
                <span className="text-red-500">*</span>
              </Label>
            </div>
            <Select
              name="specification"
              value={quote.specification}
              onChange={handleQuoteChange}
            >
              <option></option>
              <option>As per IS 6313 (Part 2):2013 & 2022</option>
              <option>As per IS 6313 (Part 2):2013</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4 ">
          <div className="col-span-6 border p-1">
            <Label className="flex justify-between mb-2">
              <span>Work Area Type:</span>{" "}
              <Button
                onClick={() => setAreaTypeModel(true)}
                gradientDuoTone="tealToLime"
                size="xs"
              >
                +
              </Button>
            </Label>
            <Select
              name="workAreaType"
              onChange={handleInfoChange}
              value={infoObj.workAreaType}
            >
              <option></option>
              <option>Basement Area</option>
              <option>Retaining Wall</option>
              <option>Raft</option>
              <option>Plinth</option>
              <option>Periphery</option>
              <option>Floor</option>
              <option>Basement Area (Horizontal)</option>
              <option>Basement Area (Vertical)</option>
            </Select>
          </div>
          <div className="col-span-4 border p-1">
            <div className="col-span-2">
              <fieldset className="flex gap-4 w-full justify-evenly">
                <legend className="mb-4">Choose doc type</legend>
                <div className="flex gap-2">
                  <Radio
                    id="united-state"
                    name="countries"
                    value="standard"
                    defaultChecked
                    onChange={() => setDocType("standard")}
                  />
                  <Label htmlFor="united-state">Standard</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="supply/apply"
                    name="countries"
                    value="supply/apply"
                    onChange={() => setDocType("supply/apply")}
                  />
                  <Label htmlFor="supply/apply">Supply/Apply</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio
                    id="supply"
                    name="countries"
                    value="supply"
                    onChange={() => setDocType("supply")}
                  />
                  <Label htmlFor="supply">Supply</Label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        {types.length >= 1
          ? types.map((type) => (
              <div
                key={type.workAreaType}
                className="grid grid-cols-12 gap-4 mb-4  border border-blue-600 "
              >
                {docType === "standard" && (
                  <InputStandard
                    type={type}
                    infoObj={infoObj}
                    handleInfoChange={handleInfoChange}
                    handleMoreInfo={handleMoreInfo}
                  />
                )}
                {docType === "supply/apply" && (
                  <InputSupplyApply
                    type={type}
                    infoObj={infoObj}
                    handleInfoChange={handleInfoChange}
                    handleMoreInfo={handleMoreInfo}
                  />
                )}
                {docType === "supply" && (
                  <InputSupply
                    type={type}
                    infoObj={infoObj}
                    handleInfoChange={handleInfoChange}
                    handleMoreInfo={handleMoreInfo}
                  />
                )}
              </div>
            ))
          : null}
        {infoArray.length > 0
          ? infoArray.map((info, idx) => (
              <div
                key={idx}
                className="flex flex-wrap gap-4 mb-4 p-1 border-b-4"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full">
                  {idx + 1}
                </span>
                <div className="flex flex-col p-1">
                  <div className="font-bold">Work Area Type:</div>
                  <div>{info.workAreaType}</div>
                </div>
                <div className="flex flex-col p-1">
                  <div className="font-bold">Work Area Measurement:</div>
                  <div>{info.workArea + " " + info.workAreaUnit}</div>
                </div>
                {info.chemicalRate && (
                  <div className="flex flex-col p-1">
                    <div className="font-bold">Chemical Rate:</div>
                    <div>{info.chemicalRate + " " + info.chemicalRateUnit}</div>
                  </div>
                )}
                <div className="flex flex-col p-1">
                  <div className="font-bold">Chemical:</div>
                  <div>{info.chemical}</div>
                </div>
                {info.applyRate && (
                  <div className="flex flex-col p-1">
                    <div className="font-bold">Apply Rate:</div>
                    <div>{info.applyRate + " " + info.applyRateUnit}</div>
                  </div>
                )}
                {info.serviceRate && (
                  <div className="flex flex-col p-1">
                    <div className="font-bold">Service Rate:</div>
                    <div>{info.serviceRate + " " + info.serviceRateUnit}</div>
                  </div>
                )}
                {info.chemicalQuantity && (
                  <div className="flex flex-col p-1">
                    <div className="font-bold">Chemical Qnt:</div>
                    <div>{info.chemicalQuantity + " Ltr"}</div>
                  </div>
                )}
                <div className="flex items-center justify-center p-1">
                  <Button
                    gradientMonochrome="failure"
                    className="rounded-full"
                    onClick={() => handleDeleteInfo(info.workAreaType)}
                  >
                    <MdDelete size="15px" />
                  </Button>
                </div>
              </div>
            ))
          : null}

        <div className="col-span-1 mb-4">
          <Label>Notes: </Label>
          <Textarea
            name="note"
            onChange={handleQuoteChange}
            value={quote.note}
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

export default NewQuote;
