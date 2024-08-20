/* eslint-disable react/prop-types */
import { Button, TextInput, Label, Card, Select } from "flowbite-react";
import { useEffect, useState } from "react";

function DCForm({ quoteInfo }) {
  const [validInput, setValidInput] = useState(false);
  const [dcObj, setDcObj] = useState({
    chemical: "",
    BatchNo: "",
    chemicalqty: "",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setDcObj((prev) => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    if (
      dcObj.chemical !== "" &&
      dcObj.BatchNo !== "" &&
      dcObj.chemicalqty !== ""
    ) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }, [dcObj]);

  function handleSubmit() {
    if (validInput) {
      // Submit the form or handle the data
      console.log("Form Submitted:", dcObj);
    } else {
      console.log("Invalid input, please fill all fields.");
    }
  }

  return (
    <Card className="max-w-md mx-auto p-6">
      <h3 className="text-xl font-semibold text-center mb-4">DC Form</h3>
      <form className="space-y-4">
        <div>
          <Label htmlFor="chemical" value="Chemical" />
          <Select
            id="chemical"
            name="chemical"
            placeholder="Enter chemical name"
            value={dcObj.chemical}
            onChange={handleInputChange}
            required
          >
            <option></option>
            {quoteInfo.map((info) => (
              <option key={info._id}>{info.chemical}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="BatchNo" value="Batch Number" />
          <TextInput
            id="BatchNo"
            name="BatchNo"
            placeholder="Enter batch number"
            value={dcObj.BatchNo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="chemicalqty" value="Quantity" />
          <TextInput
            id="chemicalqty"
            name="chemicalqty"
            placeholder="Enter quantity"
            value={dcObj.chemicalqty}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button
          type="button"
          disabled={!validInput}
          onClick={handleSubmit}
          fullSized
        >
          Submit
        </Button>
      </form>
    </Card>
  );
}

export default DCForm;
