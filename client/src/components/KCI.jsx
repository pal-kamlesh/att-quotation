/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button, Label, Table, TextInput } from "flowbite-react";
import { GiCancel } from "react-icons/gi";
import { customAlphabet } from "nanoid";
import { toast } from "react-toastify";

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

  useEffect(() => {
    const isValid =
      kciObj.name !== "" && (kciObj.contact !== "" || kciObj.email !== "");
    setValidKci(isValid);
  }, [kciObj]);

  function handleKci(e) {
    const { name, value } = e.target;
    setKciObj((prev) => ({ ...prev, [name]: value }));
  }

  function deleteKci(id) {
    setQuote((prev) => ({
      ...prev,
      [addressKey]: {
        ...prev[addressKey],
        kci: prev[addressKey].kci.filter((obj) => obj.id !== id),
      },
    }));
  }

  function addKci() {
    if (kciObj.name !== "" && (kciObj.contact !== "" || kciObj.email !== "")) {
      setQuote((prev) => ({
        ...prev,
        [addressKey]: {
          ...prev[addressKey],
          kci: [...prev[addressKey].kci, kciObj],
        },
      }));
      setKciObj({
        id: nanoid(),
        name: "",
        designation: "",
        contact: "",
        email: "",
      });
    } else {
      toast.error("Please fill out all required fields.");
    }
  }

  return (
    <div className="border rounded p-4 mt-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Key Contact Information (KCI)</h2>
        <Button
          onClick={addKci}
          gradientDuoTone={validKci ? "tealToLime" : "pinkToOrange"}
          size="xs"
          className="border"
        >
          + Add KCI
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
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
      </div>
      <div className="overflow-x-auto">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell>Sr.No</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Contact</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {quote[addressKey]?.kci.map((kci, idx) => (
              <Table.Row
                key={kci.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                } dark:bg-gray-800`}
              >
                <Table.Cell>{idx + 1}</Table.Cell>
                <Table.Cell>{kci.name}</Table.Cell>
                <Table.Cell>{kci.contact}</Table.Cell>
                <Table.Cell>{kci.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() => deleteKci(kci.id)}
                    size="xs"
                    className="bg-red-400 hover:bg-red-600"
                  >
                    <GiCancel className="text-white" />
                  </Button>
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
