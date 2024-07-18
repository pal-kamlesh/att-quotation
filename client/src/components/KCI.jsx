/* eslint-disable react/prop-types */
import { Button, Label, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
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
    if (kciObj.name !== "" && (kciObj.contact !== "" || kciObj.email !== "")) {
      setValidKci(true);
    } else {
      setValidKci(false);
    }
  }, [kciObj.contact, kciObj.email, kciObj.name]);

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
  function moredata() {
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
      return toast.error("This much info is not suffiecient.");
    }
  }
  return (
    <div>
      <div className="max-w-full flex justify-between items-center border-t border-l border-r mt-1">
        <div></div>
        <h2>KCI</h2>
        <Button
          onClick={moredata}
          gradientDuoTone={validKci ? "tealToLime" : "pinkToOrange"}
          size="xs"
          className="border"
        >
          +
        </Button>
      </div>
      <div className="max-w-full flex gap-1 border-b border-l border-r">
        <div className="">
          <div className="mb-2 block">
            <Label htmlFor="name">
              <span>Name: </span>
            </Label>
          </div>
          <TextInput name="name" onChange={handleKci} value={kciObj.name} />
        </div>
        <div className="">
          <div className="mb-2 block">
            <Label htmlFor="contact">
              <span>Contact: </span>
            </Label>
          </div>
          <TextInput
            name="contact"
            onChange={handleKci}
            value={kciObj.contact}
          />
        </div>
        <div className="">
          <div className="mb-2 block">
            <Label htmlFor="billToAddress.pincode">
              <span>Email: </span>
            </Label>
          </div>
          <TextInput
            name="email"
            type="email"
            value={kciObj.email}
            onChange={handleKci}
          />
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table hoverable={true} className="w-full">
          <Table.Head>
            <Table.HeadCell>Sr.No</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Contact</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {quote[addressKey].kci.length > 0 &&
              quote[addressKey].kci.map((kci, idx) => (
                <Table.Row key={kci.id} className="bg-white dark:bg-gray-800">
                  <Table.Cell>{idx + 1}</Table.Cell>
                  <Table.Cell>{kci.name}</Table.Cell>
                  <Table.Cell>{kci.contact}</Table.Cell>
                  <Table.Cell>{kci.email}</Table.Cell>
                  <Table.Cell onClick={() => deleteKci(kci.id)}>
                    <div className="bg-red-400 rounded-full hover:bg-red-600 text-black hover:cursor-pointer size-7">
                      <GiCancel className=" size-7" />
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
