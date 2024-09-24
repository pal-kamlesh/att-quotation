/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, Label, Table, TableCell, TextInput } from "flowbite-react";
import { GiCancel } from "react-icons/gi";
import { customAlphabet } from "nanoid";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  21
);

function KCI({ quote, setQuote, addressKey }) {
  const [validKci, setValidKci] = useState(false);
  const [kciObj, setKciObj] = useState({
    id: nanoid(),
    name: "",
    designation: "",
    contact: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [kciArray, setKciArray] = useState(quote[String(addressKey)]?.kci);

  useEffect(() => {
    setKciArray(quote[String(addressKey)]?.kci);
  }, [addressKey, quote]);

  useEffect(() => {
    const isValid =
      kciObj.name !== "" && (kciObj.contact !== "" || kciObj.email !== "");
    setValidKci(isValid);
  }, [kciObj]);

  useEffect(() => {
    setQuote((prev) => ({
      ...prev,
      [addressKey]: {
        ...prev[addressKey],
        kci: kciArray,
      },
    }));
  }, [addressKey, kciArray, setQuote]);
  function handleKci(e) {
    const { name, value } = e.target;
    setKciObj((prev) => ({ ...prev, [name]: value }));
  }

  function deleteKci(id) {
    setKciArray((prev) => prev.filter((kci) => kci._Id !== id));
  }

  function addKci() {
    if (kciObj.name !== "" && (kciObj.contact !== "" || kciObj.email !== "")) {
      setKciArray((prev) => [...prev, kciObj]);
      setKciObj({
        id: nanoid(),
        name: "",
        designation: "",
        contact: "",
        email: "",
      });
      setShowForm(false);
    } else {
      toast.error("Please fill out all required fields.");
    }
  }
  function editKCI(id) {
    const kci = quote[String(addressKey)].kci.find((el) => el._id !== id);
    setKciObj(kci);
    setKciArray((prev) => prev.filter((info) => info._id === id));
    setShowForm(true);
  }

  return (
    <div className="bg-[#C8A1E0] border rounded-lg shadow-md p-4 mt-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Key Contact Information (KCI)</h2>
        <Button
          gradientMonochrome="gray"
          className="mb-2 border-2 border-gray-500"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Add Info"}
        </Button>
      </div>
      {showForm && (
        <div>
          <div className="flex gap-4 mb-4">
            <div>
              <Label htmlFor="name">Name:</Label>
              <TextInput name="name" value={kciObj.name} onChange={handleKci} />
            </div>
            <div>
              <Label htmlFor="contact">Contact:</Label>
              <TextInput
                name="contact"
                value={kciObj.contact}
                onChange={handleKci}
              />
            </div>
            <div>
              <Label htmlFor="email">Email:</Label>
              <TextInput
                type="email"
                name="email"
                value={kciObj.email}
                onChange={handleKci}
              />
            </div>
            <div className="flex items-center justify-center mt-5">
              <Button
                onClick={addKci}
                gradientDuoTone={validKci ? "tealToLime" : "pinkToOrange"}
                size="xs"
                className="border"
              >
                +
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Contact</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {kciArray.map((kci, idx) => (
              <Table.Row
                key={kci.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                } dark:bg-gray-800`}
              >
                <Table.Cell>{kci.name}</Table.Cell>
                <Table.Cell>{kci.contact}</Table.Cell>
                <Table.Cell>{kci.email}</Table.Cell>

                <TableCell>
                  <button
                    onClick={() => editKCI(kci.id)}
                    size="xs"
                    className="bg-green-500 rounded-full hover:bg-green-700  text-white p-1"
                  >
                    <FaEdit className="text-white w-5 h-5" />
                  </button>
                </TableCell>
                <Table.Cell>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => deleteKci(kci.id)}
                      size="xs"
                      className="bg-red-500 rounded-full hover:bg-red-700 text-white p-1"
                    >
                      <GiCancel className="text-white w-5 h-5" />
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

export default KCI;
