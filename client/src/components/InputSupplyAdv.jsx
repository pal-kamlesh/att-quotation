/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Button, Label, Select, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { GiCancel } from "react-icons/gi";
import { customAlphabet } from "nanoid";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  21
);

function InputSupplyAdv({ quote, setQuote }) {
  const [validInput, setValidInput] = useState(false);
  const [infoArray, setInfoArray] = useState(quote.quoteInfo);
  const [infoObj, setInfoObj] = useState({
    _id: nanoid(),
    workAreaType: "",
    chemicalRate: "",
    chemicalRateUnit: "",
    chemicalQuantity: "",
    chemical: "",
  });

  useEffect(() => {
    if (
      infoObj.workAreaType !== "" &&
      infoObj.chemicalRate !== "" &&
      infoObj.chemicalQuantity !== "" &&
      infoObj.chemical !== ""
    ) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }, [
    infoObj.workAreaType,
    infoObj.chemicalRate,
    infoObj.chemicalRateUnit,
    infoObj.chemicalQuantity,
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
      infoObj.chemicalRate !== "" &&
      infoObj.chemicalQuantity !== "" &&
      infoObj.chemical !== ""
    ) {
      setInfoArray((prevArray) => [...prevArray, infoObj]);
      setInfoObj({
        _id: nanoid(),
        workAreaType: "",
        chemicalRate: "",
        chemicalRateUnit: "",
        chemicalQuantity: "",
        chemical: "",
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

  return (
    <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="border border-yellow-400 p-3 rounded bg-yellow-100">
          <Label className="text-yellow-700">Work Area Type: </Label>
          <Select
            name="workAreaType"
            onChange={handleInfoChange}
            value={infoObj.workAreaType}
            className="bg-yellow-100 border-yellow-400 focus:border-yellow-600 focus:ring-yellow-600"
          >
            <option value=""></option>
            <option value="Basement Area">Basement Area</option>
            <option value="Retaining Wall">Retaining Wall</option>
            <option value="Raft">Raft</option>
            <option value="Plinth">Plinth</option>
            <option value="Periphery">Periphery</option>
            <option value="Floor">Floor</option>
            <option value="Basement Area (Horizontal)">
              Basement Area (Horizontal)
            </option>
            <option value="Basement Area (Vertical)">
              Basement Area (Vertical)
            </option>
          </Select>
        </div>
        <div className="border border-yellow-400 p-3 rounded bg-yellow-100">
          <Label className="text-yellow-700">Chemical Rate: </Label>
          <div className="flex gap-2">
            <TextInput
              name="chemicalRate"
              value={infoObj.chemicalRate}
              onChange={handleInfoChange}
              className="flex-1 bg-yellow-100 border-yellow-400 focus:border-yellow-600 focus:ring-yellow-600"
            />
            <Select
              name="chemicalRateUnit"
              onChange={handleInfoChange}
              value={infoObj.chemicalRateUnit}
              className="flex-1 bg-yellow-100 border-yellow-400 focus:border-yellow-600 focus:ring-yellow-600"
            >
              <option value=""></option>
              <option value="Per Ltr.">Per Ltr.</option>
              <option value="Lumpsum">Lumpsum</option>
            </Select>
          </div>
        </div>
        <div className="border border-yellow-400 p-3 rounded bg-yellow-100">
          <Label className="text-yellow-700">Chemical Quantity: </Label>
          <TextInput
            name="chemicalQuantity"
            value={infoObj.chemicalQuantity}
            onChange={handleInfoChange}
            className="bg-yellow-100 border-yellow-400 focus:border-yellow-600 focus:ring-yellow-600"
          />
        </div>
        <div className="border border-yellow-400 p-3 rounded bg-yellow-100">
          <Label className="text-yellow-700">Chemical: </Label>
          <div className="flex gap-2 items-center justify-center">
            <Select
              name="chemical"
              onChange={handleInfoChange}
              value={infoObj.chemical}
              className="flex-1 bg-yellow-100 border-yellow-400 focus:border-yellow-600 focus:ring-yellow-600"
            >
              <option value=""></option>
              <option value="Imidachloprid 30.5% SC">
                Imidachloprid 30.5% SC
              </option>
              <option value="Imidachloprid 30.5% SC 'Termida'">
                Imidachloprid 30.5% SC 'Termida'
              </option>
              <option value="Chloropyriphos 20% EC">
                Chloropyriphos 20% EC
              </option>
              <option value='Imidachloprid 30.5% SC ("PREMISE" - By Bayer India/ENVU)'>
                Imidachloprid 30.5% SC ("PREMISE" - By Bayer India/ENVU)
              </option>
            </Select>
            <Button
              onClick={moreInfo}
              color={validInput ? "warning" : "failure"}
              size="xs"
              className="border flex items-center justify-center w-7 h-7"
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto mt-4">
        <Table hoverable={true} className="w-full">
          <Table.Head className="bg-yellow-100 rounded-lg">
            <Table.HeadCell className="text-yellow-700">Sr.No</Table.HeadCell>
            <Table.HeadCell className="text-yellow-700">
              Work Area Type
            </Table.HeadCell>
            <Table.HeadCell className="text-yellow-700">
              Chemical Rate
            </Table.HeadCell>
            <Table.HeadCell className="text-yellow-700">Unit</Table.HeadCell>
            <Table.HeadCell className="text-yellow-700">
              Chemical Quantity
            </Table.HeadCell>
            <Table.HeadCell className="text-yellow-700">
              Chemical
            </Table.HeadCell>
            <Table.HeadCell className="text-yellow-700">Delete</Table.HeadCell>
            <Table.HeadCell className="text-yellow-700">Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y divide-yellow-400">
            {infoArray.length > 0 &&
              infoArray.map((info, idx) => (
                <Table.Row
                  key={info._id}
                  className="bg-yellow-100 hover:bg-yellow-200"
                >
                  <Table.Cell>{idx + 1}</Table.Cell>
                  <Table.Cell>{info.workAreaType}</Table.Cell>
                  <Table.Cell>{info.chemicalRate}</Table.Cell>
                  <Table.Cell>{info.chemicalRateUnit}</Table.Cell>
                  <Table.Cell>{info.chemicalQuantity}</Table.Cell>
                  <Table.Cell>{info.chemical}</Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-red-500 rounded-full hover:bg-red-700 text-white p-1"
                        onClick={() => deleteInfo(info._id)}
                      >
                        <GiCancel className="w-5 h-5" />
                      </button>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center justify-center">
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

export default InputSupplyAdv;
