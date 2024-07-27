/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import {
  Button,
  Label,
  Select,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { GiCancel } from "react-icons/gi";
import { customAlphabet } from "nanoid";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  21
);

function InputStandardAdv({ quote, setQuote }) {
  const [validInput, setValidInput] = useState(false);
  const [infoArray, setInfoArray] = useState(quote.quoteInfo);
  const [infoObj, setInfoObj] = useState({
    _id: nanoid(),
    workAreaType: "",
    workArea: "",
    workAreaUnit: "",
    serviceRate: "",
    serviceRateUnit: "",
    chemical: "",
    description: "",
  });

  useEffect(() => {
    if (
      infoObj.workAreaType !== "" &&
      infoObj.workArea !== "" &&
      infoObj.serviceRate !== "" &&
      infoObj.chemical !== ""
    ) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }, [
    infoObj.workAreaType,
    infoObj.workArea,
    infoObj.workAreaUnit,
    infoObj.serviceRate,
    infoObj.serviceRateUnit,
    infoObj.chemical,
  ]);

  function handleInfoChange(e) {
    const { name, value } = e.target;
    setInfoObj((prev) => ({ ...prev, [name]: value }));
  }

  function deleteInfo(id) {
    setInfoArray((prev) => prev.filter((info) => info._id !== id));
  }
  function editInfo(id) {
    const info = infoArray.find((el) => el._id === id);
    setInfoObj(info);
    setInfoArray((prev) => prev.filter((info) => info._id !== id));
  }

  function moreInfo() {
    if (
      infoObj.workAreaType !== "" &&
      infoObj.workArea !== "" &&
      infoObj.serviceRate !== "" &&
      infoObj.chemical !== ""
    ) {
      setInfoArray((prevArray) => [...prevArray, infoObj]);
      setInfoObj({
        _id: nanoid(),
        workAreaType: "",
        workArea: "",
        workAreaUnit: "",
        serviceRate: "",
        serviceRateUnit: "",
        chemical: "",
        description: "",
      });
    } else {
      return toast.error("This much info is not sufficient.");
    }
  }
  useEffect(() => {
    setQuote((prev) => ({
      ...prev,
      quoteInfo: infoArray,
    }));
  }, [infoArray, setQuote]);
  useEffect(() => {
    let newServiceRateUnit = "";

    switch (infoObj.workAreaUnit) {
      case "Sq.fts":
        newServiceRateUnit = "Per Sq.ft";
        break;
      case "Sq.mts":
        newServiceRateUnit = "Per Sq.mt";
        break;
      case "R.fts":
        newServiceRateUnit = "Per R.ft";
        break;
      case "R.mts":
        newServiceRateUnit = "Per R.mt";
        break;
      default:
        newServiceRateUnit = "";
    }

    setInfoObj((prevInfoObj) => ({
      ...prevInfoObj,
      serviceRateUnit: newServiceRateUnit,
    }));
  }, [infoObj.workAreaUnit]);
  return (
    <div className="bg-lime-200 p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="border border-lime-400 p-3 rounded bg-lime-100">
          <Label className="text-lime-700">Work Area Type: </Label>
          <Select
            name="workAreaType"
            onChange={handleInfoChange}
            value={infoObj.workAreaType}
            className="bg-lime-50 border-lime-400 focus:border-lime-600 focus:ring-lime-600"
          >
            <option value=""></option>
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
        <div className="border border-lime-400 p-3 rounded bg-lime-100">
          <Label className="text-lime-700">Work Area: </Label>
          <div className="flex gap-2">
            <TextInput
              name="workArea"
              value={infoObj.workArea}
              onChange={handleInfoChange}
              className="flex-1 bg-lime-50 border-lime-400 focus:border-lime-600 focus:ring-lime-600"
            />
            <Select
              name="workAreaUnit"
              onChange={handleInfoChange}
              value={infoObj.workAreaUnit}
              className="flex-1 bg-lime-50 border-lime-400 focus:border-lime-600 focus:ring-lime-600"
            >
              <option value=""></option>
              <option value="Sq.fts">Sq.fts</option>
              <option value="Sq.mts">Sq.mts</option>
              <option value="R.fts">R.fts</option>
              <option value="R.mts">R.mts</option>
            </Select>
          </div>
        </div>
        <div className="border border-lime-400 p-3 rounded bg-lime-100">
          <Label className="text-lime-700">Service Rate: </Label>
          <div className="flex gap-2">
            <TextInput
              name="serviceRate"
              value={infoObj.serviceRate}
              onChange={handleInfoChange}
              className="flex-1 bg-lime-50 border-lime-400 focus:border-lime-600 focus:ring-lime-600"
            />
            <Select
              name="serviceRateUnit"
              onChange={handleInfoChange}
              value={infoObj.serviceRateUnit}
              className="flex-1 bg-lime-50 border-lime-400 focus:border-lime-600 focus:ring-lime-600"
            >
              <option value=""></option>
              <option value="Per Sq.ft">Per Sq.ft</option>
              <option value="Per Sq.mt">Per Sq.mt</option>
              <option value="Per R.ft">Per R.ft</option>
              <option value="Per R.mt">Per R.mt</option>
              <option value="Lumpsum">Lumpsum</option>
            </Select>
          </div>
        </div>
        <div className="border border-lime-400 p-3 rounded bg-lime-100">
          <Label className="text-lime-700">Chemical: </Label>
          <div className="flex gap-2 items-center justify-center">
            <Select
              name="chemical"
              onChange={handleInfoChange}
              value={infoObj.chemical}
              className="flex-1 bg-lime-50 border-lime-400 focus:border-lime-600 focus:ring-lime-600"
            >
              <option value=""></option>
              <option>Imidachloprid 30.5% SC</option>
              <option>Imidachloprid 30.5% SC 'Termida'</option>
              <option>Chloropyriphos 20% EC</option>
              <option>
                Imidachloprid 30.5% SC ("PREMISE" - By Bayer India/ENVU)
              </option>
            </Select>
            <Button
              onClick={moreInfo}
              color={validInput ? "success" : "failure"}
              className="border flex items-center justify-center w-7 h-7"
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="border border-lime-400 p-3 rounded bg-lime-100">
          <Label className="text-lime-700">Description: </Label>
          <div className="flex gap-2">
            <Textarea
              name="description"
              value={infoObj.description}
              onChange={handleInfoChange}
              className="flex-1 bg-white border-lime-400 focus:border-lime-600 focus:ring-lime-600"
            />
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table hoverable={true} className="w-full">
          <Table.Head className="bg-lime-200 rounded-lg">
            <Table.HeadCell className="text-lime-700">Sr.No</Table.HeadCell>
            <Table.HeadCell className="text-lime-700">
              Work Area Type
            </Table.HeadCell>
            <Table.HeadCell className="text-lime-700">Work Area</Table.HeadCell>
            <Table.HeadCell className="text-lime-700">
              Work Area Unit
            </Table.HeadCell>
            <Table.HeadCell className="text-lime-700">
              Service Rate
            </Table.HeadCell>
            <Table.HeadCell className="text-lime-700">Unit</Table.HeadCell>
            <Table.HeadCell className="text-lime-700">Chemical</Table.HeadCell>
            <Table.HeadCell className="text-lime-700">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-lime-400">
            {infoArray.length > 0 &&
              infoArray.map((info, idx) => (
                <Table.Row
                  key={info._id}
                  className="bg-lime-100 hover:bg-lime-200"
                >
                  <Table.Cell>{idx + 1}</Table.Cell>
                  <Table.Cell>{info.workAreaType}</Table.Cell>
                  <Table.Cell>{info.workArea}</Table.Cell>
                  <Table.Cell>{info.workAreaUnit}</Table.Cell>
                  <Table.Cell>{info.serviceRate}</Table.Cell>
                  <Table.Cell>{info.serviceRateUnit}</Table.Cell>
                  <Table.Cell>{info.chemical}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="bg-red-500 rounded-full hover:bg-red-700 text-white p-1"
                        onClick={() => deleteInfo(info._id)}
                      >
                        <GiCancel className="w-5 h-5" />
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-700 rounded-full text-white p-1"
                        onClick={() => editInfo(info._id)}
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

export default InputStandardAdv;
