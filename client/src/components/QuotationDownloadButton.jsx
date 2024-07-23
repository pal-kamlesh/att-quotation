import { useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ImageRun,
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { docxData } from "../redux/quote/quoteSlice";
import headerImage from "../images/header.png";
import footerImage from "../images/footer.png";
import stamp from "../images/stamp.png";
import { Button } from "flowbite-react";
import { saprateQuoteInfo } from "../funtions/funtion.js";

// eslint-disable-next-line react/prop-types
const QuotationGenerator = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const generateQuotation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch data from backend
      const actionResult = await dispatch(docxData(id));
      const result = unwrapResult(actionResult);
      const data = result.result;
      let standard = [];
      let applySupply = [];
      let supply = [];
      if (data.docType) {
        result.result.docType === "standard"
          ? (standard = data.quoteInfo)
          : data.docType === "supply/apply"
          ? (applySupply = data.quoteInfo)
          : data.docType === "supply"
          ? (supply = data.quoteInfo)
          : null;
      } else {
        [standard, applySupply] = saprateQuoteInfo(data.quoteInfo);
      }

      const children = [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: await fetchImage(headerImage),
              transformation: {
                width: 600,
                height: 75,
              },
            }),
          ],
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [new TextRun({ text: "Quotation", bold: true, size: 24 })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Quotation No: ${
                data.quotationNo ? data.quotationNo : data._id
              }`,
              size: 18,
              bold: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Date: ${new Date(data.quotationDate).toLocaleDateString(
                "en-GB"
              )}`,
              size: 18,
              bold: true,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        createAddressTable(data.billToAddress, data.shipToAddress),
        new Paragraph({ text: "" }),
        ...(data.kindAttention !== "" && data.kindAttention !== "NA"
          ? [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Kind Attention: ${data.kindAttentionPrefix} ${data.kindAttention}`,
                    bold: true,
                  }),
                ],
              }),
            ]
          : []),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text: `We thank for your enquiry & the time given to our Representative ${data.salesPerson.prefix} ${data.salesPerson.username}`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({ text: "" }),
        createInfoTable(data, standard.length, applySupply.length),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [new TextRun({ text: "Quote Information:", bold: true })],
        }),
      ];

      if (standard.length > 0) {
        children.push(createQuoteInfoTableStandard(standard));
      }

      children.push(new Paragraph({ text: "" }));

      if (applySupply.length > 0) {
        children.push(createQuoteInfoTableApplySupply(applySupply));
      }

      children.push(new Paragraph({ text: "" }));
      if (supply.length > 0) {
        children.push(createQuoteInfoTableSupply(supply));
      }

      children.push(
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text:
                data?.docType === "supply"
                  ? "The offer provided is for product supply as per your requirements provided and we hope you will accept the same and will give us the opportunity to supply."
                  : `We hope you will accept the same and will give us the opportunity to be of service to you.`,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Please call us for clarification if any.`,
            }),
          ],
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Thanking you,`,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Yours faithfully,`,
            }),
          ],
        }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text: `For EXPRESS PESTICIDES PVT. LTD.`,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new ImageRun({
              data: await fetchImage(stamp),
              transformation: {
                width: 50,
                height: 40,
              },
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Authorized Signatory`,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${data.salesPerson.initials}/${data.createdBy.initials}`,
            }),
          ],
        })
      );

      //the footer image at the end
      children.push(
        new Paragraph({ text: "" }), // Add some space before the footer image
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              data: await fetchImage(footerImage),
              transformation: {
                width: 600,
                height: 65,
              },
            }),
          ],
        })
      );

      // Generate DOCX
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Arial",
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 500, // 0.5 cm in twips (1 cm = 1000 twips)
                  bottom: 500, // 0.5 cm in twips
                  left: 800, // 1.27 cm in twips
                  right: 800, // 1.27 cm in twips
                },
              },
            },
            children: children,
          },
        ],
      });

      // Generate and save file
      const buffer = await Packer.toBlob(doc);
      saveAs(
        buffer,
        `Quotation_${data.quotationNo ? data.quotationNo : data._id}.docx`
      );
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch image data as ArrayBuffer
  const fetchImage = async (imagePath) => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return await blob.arrayBuffer();
  };
  // eslint-disable-next-line no-unused-vars
  const boldWithinText = (boldText, normalText) => {
    const parts = normalText.split(boldText);
    const elements = parts.reduce((acc, part, index) => {
      acc.push(new TextRun(part));
      if (index < parts.length - 1) {
        acc.push(new TextRun({ text: boldText, bold: true }));
      }
      return acc;
    }, []);
    return [new Paragraph({ children: elements })];
  };
  const createAddressTable = (billTo, shipTo) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({ text: "Bill To:", bold: true }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: billTo.prefix + " " + billTo.name + ".",
                      bold: true,
                    }),
                  ],
                }),
                new Paragraph({ text: billTo.a1 + " " + billTo.a2 + "," }),
                new Paragraph({ text: billTo.a3 + "," }),
                new Paragraph({ text: billTo.a4 + "," }),
                new Paragraph({
                  text: `${billTo.city} - ${billTo.pincode},`,
                }),
                new Paragraph({ text: billTo.a5 + "." }),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "Ship To:",
                  bold: true,
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: shipTo.projectName + ".", bold: true }),
                  ],
                }),
                new Paragraph({ text: shipTo.projectName + ".", bold: true }),
                new Paragraph({ text: shipTo.a1 + " " + shipTo.a2 + "," }),
                new Paragraph({ text: shipTo.a3 + "," }),
                new Paragraph({ text: shipTo.a4 + "," }),
                new Paragraph({
                  text: `${shipTo.city} - ${shipTo.pincode},`,
                }),
                new Paragraph({ text: shipTo.a5 + "." }),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
    });
  };

  const createInfoRow = (label, value) => {
    // Create a TextRun for the label with bold formatting
    const labelText = new TextRun({
      text: label,
      bold: true,
    });

    let valueContent;

    if (Array.isArray(value)) {
      if (value.length === 1) {
        // If there's only one element, treat it as a normal string
        valueContent = [
          new Paragraph({
            children: [
              new TextRun({
                text: value[0],
              }),
            ],
          }),
        ];
      } else {
        // If there's more than one element, create numbered paragraphs
        valueContent = value.map(
          (item, index) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${item}`,
                }),
              ],
            })
        );
      }
    } else {
      // If value is not an array, create a single paragraph
      valueContent = [
        new Paragraph({
          children: [
            new TextRun({
              text: value,
            }),
          ],
        }),
      ];
    }

    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [labelText] })],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: valueContent,
          width: { size: 90, type: WidthType.PERCENTAGE },
        }),
      ],
    });
  };
  const createInfoTable = (data, sL, aL) => {
    const commonFields = [
      { label: "Subject:", value: data.subject + " " + data.shipToAddress.a4 },
      { label: "Reference:", value: data.reference },
      {
        label: "Treatment Type:",
        value: data.treatmentType + "  [Sac-code ... 998531]",
      },
      { label: "Specification:", value: data.specification },
      { label: "Payment Terms:", value: data.paymentTerms },
      { label: "Taxation:", value: data.taxation },
    ];

    const supplyFields = [...commonFields];

    const normalFields = [
      ...commonFields,
      { label: "Equipments:", value: data.equipments },
      {
        label: "Service Warranty:",
        value:
          "10 Years In case of subterranean or ground dwelling of termite infestation during the guarantee period, we undertake to treat the same and eradicate the termite infestation without any extra cost to you. This guarantee will be forwarded on stamp paper.",
      },
    ];

    let fields = data.docType === "supply" ? supplyFields : normalFields;

    // Conditionally add the Note field if it's not empty
    if (data.note && data.note.trim() !== "") {
      fields.push({ label: "Note:", value: data.note });
    }

    const rows = fields.flatMap((field) => [
      createInfoRow(field.label, field.value),
      ...(sL <= 2 && aL <= 5 ? [createEmptyRow()] : []),
    ]);

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: rows,
    });
  };
  const createEmptyRow = () => {
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({})],
        }),
        new TableCell({
          children: [new Paragraph({})],
        }),
      ],
    });
  };

  const createQuoteInfoTableStandard = (quoteInfo) => {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            "Work Area Type",
            "Work Area",
            "Service Rate",
            "Chemical",
          ].map(
            (header) =>
              new TableCell({
                children: [
                  new Paragraph({
                    text: header,
                    bold: true,
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                shading: { fill: "D3D3D3" },
                verticalAlign: VerticalAlign.CENTER,
              })
          ),
        }),
        ...quoteInfo.map(
          (info) =>
            new TableRow({
              children: [
                info.workAreaType,
                `${info.workArea} ${info.workAreaUnit}`,
                `₹ ${info.serviceRate} ${info.serviceRateUnit}`,
                info.chemical,
              ].map(
                (text) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        text,
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  })
              ),
            })
        ),
      ],
    });
  };
  const createQuoteInfoTableApplySupply = (quoteInfo) => {
    const headers = [
      { key: "workAreaType", label: "Work Area Type" },
      { key: "workArea", label: "Work Area" },
      { key: "applyRate", label: "Apply Rate" },
      { key: "chemicalQuantity", label: "Chemical Quantity" },
      { key: "chemicalRate", label: "Chemical Cost" },
      { key: "chemical", label: "Chemical" },
    ];

    // Determine which columns should be included based on the presence of data
    const includedHeaders = headers.filter((header) =>
      quoteInfo.some((info) => info[header.key])
    );

    // Create the table
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: includedHeaders.map(
            (header) =>
              new TableCell({
                children: [new Paragraph({ text: header.label, bold: true })],
                shading: { fill: "D3D3D3" },
              })
          ),
        }),
        ...quoteInfo.map(
          (info) =>
            new TableRow({
              children: includedHeaders.map((header) => {
                let text = info[header.key];

                // Handle special cases for formatting
                if (header.key === "workArea") {
                  text = `${info.workArea} ${info.workAreaUnit}`;
                } else if (header.key === "applyRate" && info.applyRate) {
                  text = `₹ ${info.applyRate} ${info.applyRateUnit}`;
                } else if (header.key === "chemicalQuantity") {
                  text = `${info.chemicalQuantity} Ltr.`;
                } else if (header.key === "chemicalRate" && info.chemicalRate) {
                  text = `₹ ${info.chemicalRate} ${info.chemicalRateUnit}`;
                }

                return new TableCell({
                  children: [new Paragraph({ text: text || "" })],
                });
              }),
            })
        ),
      ],
    });
  };
  const createQuoteInfoTableSupply = (quoteInfo) => {
    const headers = [
      { key: "workAreaType", label: "Work Area Type" },
      { key: "chemicalQuantity", label: "Chemical Quantity" },
      { key: "chemicalRate", label: "Chemical Cost" },
      { key: "chemical", label: "Chemical" },
    ];

    // Determine which columns should be included based on the presence of data
    const includedHeaders = headers.filter((header) =>
      quoteInfo.some((info) => info[header.key])
    );

    // Create the table
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: includedHeaders.map(
            (header) =>
              new TableCell({
                children: [new Paragraph({ text: header.label, bold: true })],
                shading: { fill: "D3D3D3" },
              })
          ),
        }),
        ...quoteInfo.map(
          (info) =>
            new TableRow({
              children: includedHeaders.map((header) => {
                let text = info[header.key];

                // Handle special cases for formatting
                if (header.key === "workArea") {
                  text = `${info.workArea} ${info.workAreaUnit}`;
                } else if (header.key === "applyRate" && info.applyRate) {
                  text = `₹ ${info.applyRate} ${info.applyRateUnit}`;
                } else if (header.key === "chemicalQuantity") {
                  text = `${info.chemicalQuantity} Ltr.`;
                } else if (header.key === "chemicalRate" && info.chemicalRate) {
                  text = `₹ ${info.chemicalRate} ${info.chemicalRateUnit}`;
                }

                return new TableCell({
                  children: [new Paragraph({ text: text || "" })],
                });
              }),
            })
        ),
      ],
    });
  };

  return (
    <div>
      <Button
        gradientDuoTone="purpleToPink"
        onClick={generateQuotation}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : ".docx"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default QuotationGenerator;
