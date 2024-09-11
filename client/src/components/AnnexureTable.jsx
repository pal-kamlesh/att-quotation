/* eslint-disable react/prop-types */
// src/components/StandardQtnTable.js
import {
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  TextRun,
  ImageRun,
  Packer,
  Document,
  VerticalAlign,
  BorderStyle,
  HeightRule,
} from "docx";
import { saveAs } from "file-saver";
import { fetchImage, qrCodeUint8Arrayfn } from "../funtions/funtion";
import headerImage from "../images/header.png";

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
                  children: [
                    new TextRun({
                      text: header,
                      bold: true,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  // spacing: {
                  //   before: 120, // Space before the paragraph (in twips)
                  //   after: 120, // Space after the paragraph (in twips)
                  //   line: 200, // Line spacing (1.5 line spacing in twips)
                  // },
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
                      // spacing: {
                      //   before: 120, // Space before the paragraph (in twips)
                      //   after: 120, // Space after the paragraph (in twips)
                      //   line: 200, // Line spacing (1.5 line spacing in twips)
                      // },
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
const generateStandardDoc = async (data) => {
  try {
    const title = new Paragraph({
      children: [
        new TextRun({
          text: "ANNEXURE",
          bold: true,
          size: 48, // This is the font size, 48 here means 24pt
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    });
    const header = new Paragraph({
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
    });

    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1000, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "SRNO",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 9500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Description",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Unit",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Area",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Rate",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Chemical",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
          ],
        }),
      ],
    });

    data.forEach((item, index) => {
      const row = new TableRow({
        children: [
          new TableCell({
            width: { size: 1000, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `${(index + 1).toString()}`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 9500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.description,
                bold: true,
                alignment: AlignmentType.LEFT,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.workAreaUnit,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.workArea,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `₹${item.serviceRate + " " + item.serviceRateUnit}`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.chemical,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
        ],
      });
      table.addChildElement(row);
    });

    // Add an additional row with the specified text aligned to the right
    const additionalRow = new TableRow({
      children: [
        new TableCell({
          columnSpan: 6,
          children: [
            new Paragraph({
              text: "(+)GST @ 18% As applicable",
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 200 },
            }),
          ],
        }),
      ],
    });
    table.addChildElement(additionalRow);
    return { header, title, table };
  } catch (error) {
    throw new Error("Standard BOQ filed");
  }
};
const generateSupplyDoc = async (data) => {
  try {
    const title = new Paragraph({
      children: [
        new TextRun({
          text: "ANNEXURE",
          bold: true,
          size: 48, // This is the font size, 48 here means 24pt
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    });
    const header = new Paragraph({
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
    });

    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1000, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "SRNO",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 9500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Description",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Rate",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Quantity",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Chemical",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
          ],
        }),
      ],
    });

    data.forEach((item, index) => {
      const row = new TableRow({
        children: [
          new TableCell({
            width: { size: 1000, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `${(index + 1).toString()}`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 9500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.description,
                bold: true,
                alignment: AlignmentType.LEFT,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `₹ ${item.chemicalRate} ${item.chemicalRateUnit}`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `${item.chemicalQuantity} Ltr`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.chemical,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
        ],
      });
      table.addChildElement(row);
    });

    // Add an additional row with the specified text aligned to the right
    const additionalRow = new TableRow({
      children: [
        new TableCell({
          columnSpan: 6,
          children: [
            new Paragraph({
              text: "(+) @ 18% As applicable",
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 200 },
            }),
          ],
        }),
      ],
    });
    table.addChildElement(additionalRow);
    return { header, title, table };
  } catch (error) {
    throw new Error("Standard BOQ filed");
  }
};
const generateSupplyApplyDoc = async (data) => {
  try {
    const title = new Paragraph({
      children: [
        new TextRun({
          text: "ANNEXURE",
          bold: true,
          size: 48, // This is the font size, 48 here means 24pt
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
    });
    const header = new Paragraph({
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
    });

    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 1000, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "SRNO",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 9500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Description",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Apply Rate",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Chem Qty",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 1500, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Chem Rate",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              height: { size: 850, type: WidthType.DXA },
              children: [
                new Paragraph({
                  text: "Chemical",
                  bold: true,
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 200, after: 200 },
                }),
              ],
              shading: { fill: "D3D3D3" },
            }),
          ],
        }),
      ],
    });

    data.forEach((item, index) => {
      const row = new TableRow({
        children: [
          new TableCell({
            width: { size: 1000, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `${(index + 1).toString()}`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 9500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.description,
                bold: true,
                alignment: AlignmentType.LEFT,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `₹ ${item.applyRate} ${item.applyRateUnit}`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `${item.chemicalQuantity} Ltr`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: `₹ ${item.chemicalRate} ${item.chemicalRateUnit}`,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),

          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [
              new Paragraph({
                text: item.chemical,
                bold: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 },
              }),
            ],
          }),
        ],
      });
      table.addChildElement(row);
    });

    // Add an additional row with the specified text aligned to the right
    const additionalRow = new TableRow({
      children: [
        new TableCell({
          columnSpan: 6,
          children: [
            new Paragraph({
              text: "(+) @ 18% As applicable",
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 200 },
            }),
          ],
        }),
      ],
    });
    table.addChildElement(additionalRow);
    return { header, title, table };
  } catch (error) {
    throw new Error("Standard BOQ filed");
  }
};
const generateStandardContractAdv = async (data, annexure) => {
  const {
    contractNo,
    contractDate,
    billToAddress,
    shipToAddress,
    paymentTerms,
    workOrderNo,
    workOrderDate,
    createdAt,
    gstNo,
    taxation,
    printCount,
  } = data;
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const paymentTermsArray = paymentTerms
    .split(".")
    .filter((v) => v.trim() !== "");
  const { firstTable, divider, secondTable } = await workLogdocx(data);
  const { header, title, table } =
    data.docType === "standard"
      ? await generateStandardDoc(data.quoteInfo)
      : data.docType === "supply"
      ? await generateSupplyDoc(data.quoteInfo)
      : data.docType === "supply/apply"
      ? await generateSupplyApplyDoc(data.quoteInfo)
      : null;
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
              top: 500, // 0.5 cm in twips
              bottom: 500, // 0.5 cm in twips
              left: 800, // 1.27 cm in twips
              right: 800, // 1.27 cm in twips
            },
          },
        },
        children: [
          // Header Section
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
          new Paragraph({
            children: [
              new TextRun({
                text: "PRE CONSTRUCTION ATT CONTRACT",
                bold: true,
                size: 30,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          }),
          // First Table - Contractee Information
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "CONTRACTEE INFORMATION",
                            bold: true,
                            size: 20,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                      new Paragraph({ text: "" }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.prefix} ${billToAddress.name}.`,
                            bold: true,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.a1}, ${billToAddress.a2},`,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.a3},`,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.a4},`,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.city} - ${billToAddress.pincode}`,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.a5},`,
                          }),
                        ],
                      }),
                      ...(gstNo && gstNo.trim() !== ""
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "[GST No.",
                                  bold: true,
                                }),
                                new TextRun({
                                  text: `${gstNo}]`,
                                  bold: true,
                                }),
                              ],
                              alignment: AlignmentType.LEFT,
                            }),
                          ]
                        : []),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({
                            text: `Service Contract no.     :`,
                            bold: true,
                          }),
                          new TextRun({
                            text: `${
                              contractNo
                                ? contractNo
                                : String(data._id).slice(11)
                            }`,
                            bold: true,
                            size: 28,
                          }),
                        ],
                      }),
                      new Paragraph({ text: "" }),
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                          new TextRun({
                            text: `Contract Date     :${formatDate(
                              contractDate ? contractDate : createdAt
                            )}`,
                          }),
                        ],
                      }),
                      new Paragraph({ text: "" }),
                      ...(workOrderNo
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Work Order No: ${workOrderNo}`,
                                  bold: true,
                                }),
                              ],
                            }),
                          ]
                        : []),
                      ...(workOrderNo
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Work Order Date: ${formatDate(
                                    workOrderDate
                                  )}`,
                                  bold: true,
                                }),
                              ],
                            }),
                          ]
                        : []),
                    ],
                  }),
                ],
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
                size: 0, // Very small font size
                color: "CCCCCC", // Light gray color
              }),
            ],
            spacing: { before: 12, after: 0 }, // Minimal spacing
            alignment: AlignmentType.CENTER,
          }),
          ...(billToAddress.kci.length > 0
            ? [
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "CONTACT PERSON",
                                  bold: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          shading: { fill: "D3D3D3" },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "TELEPHONE",
                                  bold: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          shading: { fill: "D3D3D3" },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "EMAIL",
                                  bold: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          shading: { fill: "D3D3D3" },
                        }),
                      ],
                    }),
                    ...billToAddress.kci.map(
                      (contact) =>
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${contact.name}`,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${contact.contact}`,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${contact.email}`,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        })
                    ),
                  ],
                  width: { size: 100, type: WidthType.PERCENTAGE },
                }),
              ]
            : []),
          // Middle Paragraph
          new Paragraph({
            children: [
              new TextRun({
                text: `To be paid by `,
              }),
              new TextRun({
                text: `${billToAddress.prefix} ${billToAddress.name} `,
                bold: true,
              }),
              new TextRun({
                text: `(Hereinafter called 'The Contractee') on the commencement of services to`,
              }),
              new TextRun({
                text: " Messrs. EXPRESS PESTICIDES PVT. LTD.",
                bold: true,
              }),
              new TextRun({
                text: "(Hereinafter called 'The Contractor') or their assigness, Administrators, representatives and Authorised agents. The Contractor shall undertake to render the Pre Construction Anti Termite Treatment to the premises of the Contractee as per the particulars given below and additional terms printed overleaf.",
              }),
            ],
            spacing: { before: 200, after: 200 },
            indent: {
              left: 0, // Adjust these values for left and right margins
              right: 100,
            },
            alignment: AlignmentType.JUSTIFIED,
          }),
          // Second Table - Service Charges and Payment Terms
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Payment terms",
                            bold: true,
                          }),
                          ...paymentTermsArray.map((v, idx) => {
                            if (idx === 0) {
                              return new TextRun({
                                text: `\t${idx === 0 ? ":" : ""} ${
                                  idx + 1
                                } ${v}`,
                              });
                            }
                          }),
                        ],
                        tabStops: [
                          {
                            type: AlignmentType.LEFT,
                            position: 3000,
                          },
                        ],
                      }),
                      ...(paymentTermsArray.length > 1
                        ? [
                            new Paragraph({
                              children: [
                                ...paymentTermsArray.map((v, idx) => {
                                  if (idx !== 0) {
                                    return new TextRun({
                                      text: `${idx === 0 ? ":" : ""} ${
                                        idx + 1
                                      } ${v}`,
                                      break:
                                        idx !== paymentTermsArray.length - 1
                                          ? 1
                                          : null,
                                    });
                                  }
                                }),
                              ],
                              indent: {
                                start: 3150, // Adjust this value to control indentation
                              },
                            }),
                          ]
                        : []),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Taxation",
                            bold: true,
                          }),
                          new TextRun({
                            text: `\t: ${taxation}`,
                          }),
                        ],
                        tabStops: [
                          {
                            type: AlignmentType.LEFT,
                            position: 3000,
                          },
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Service Warranty",
                            bold: true,
                          }),
                          new TextRun({
                            text: "\t: 10 Years",
                            bold: true,
                          }),
                        ],
                        tabStops: [
                          {
                            type: AlignmentType.LEFT,
                            position: 3000,
                          },
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "In case of subterranean or ground dwelling of termite infestation during the guarantee period, we undertake to treat the same and eradicate the termite infestation without any extra cost to you. This guarantee will be forwarded on stamp paper.",
                          }),
                        ],
                        indent: {
                          start: 3150, // Adjust this value to control indentation
                        },
                      }),
                      new Paragraph({ text: "" }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Area details & Service Charges",
                            bold: true,
                            alignment: AlignmentType.LEFT,
                          }),
                        ],
                      }),
                      getQuoteInfoTable(data.docType, data.quoteInfo),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "",
              }),
            ],
          }),
          // Third Table - Project Name & Address
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Project Name & Address",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER, // Apply alignment to Paragraph
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Type of Treatment",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.CENTER, // Apply alignment to Paragraph
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: shipToAddress.projectName,
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${shipToAddress.a1} ${shipToAddress.a2}`,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${shipToAddress.a3}, ${shipToAddress.a4}`,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${shipToAddress.a4},`,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${shipToAddress.city} - ${shipToAddress.pincode}`,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: shipToAddress.a5,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Anti Termite Treatment",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ],
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
                size: 0, // Very small font size
                color: "CCCCCC", // Light gray color
              }),
            ],
            spacing: { before: 12, after: 0 }, // Minimal spacing
            alignment: AlignmentType.CENTER,
          }),
          ...(shipToAddress.kci.length > 0
            ? [
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "CONTACT PERSON",
                                  bold: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          shading: { fill: "D3D3D3" },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "TELEPHONE",
                                  bold: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          shading: { fill: "D3D3D3" },
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "EMAIL",
                                  bold: true,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                          shading: { fill: "D3D3D3" },
                        }),
                      ],
                    }),
                    ...shipToAddress.kci.map(
                      (contact) =>
                        new TableRow({
                          children: [
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${contact.name}`,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${contact.contact}`,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            new TableCell({
                              children: [
                                new Paragraph({
                                  children: [
                                    new TextRun({
                                      text: `${contact.email}`,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        })
                    ),
                  ],
                  width: { size: 100, type: WidthType.PERCENTAGE },
                }),
              ]
            : []),
          // Signature Section
          new Paragraph({
            children: [
              new TextRun({
                text: "",
              }),
            ],
          }),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 5000, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "For EXPRESS PESTICIDES PVT. LTD.",
                            bold: true,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 200, after: 200 },
                        borders: {
                          top: { style: "none" },
                          bottom: { style: "none" },
                          left: { style: "none" },
                          right: { style: "none" },
                        },
                      }),
                      ...emptyParagraph(2),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Authorized Signatory",
                            bold: true,
                          }),
                          new TextRun({
                            text: `${data.createdBy.initials}/${data.salesPerson.initials}`,
                            break: 1,
                          }),
                        ],
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 200, after: 200 },
                        borders: {
                          top: { style: "none" },
                          bottom: { style: "none" },
                          left: { style: "none" },
                          right: { style: "none" },
                        },
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 5000, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "We hereby confirm",
                          }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 200, after: 200 },
                        borders: {
                          top: { style: "none" },
                          bottom: { style: "none" },
                          left: { style: "none" },
                          right: { style: "none" },
                        },
                      }),
                      ...emptyParagraph(3),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "(CONTRACTEE)",
                          }),
                        ],
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 200, after: 200 },
                      }),
                    ],
                    borders: {
                      top: { style: "none" },
                      bottom: { style: "none" },
                      left: { style: "none" },
                      right: { style: "none" },
                    },
                  }),
                ],
                borders: {
                  top: { style: "none" },
                  bottom: { style: "none" },
                  left: { style: "none" },
                  right: { style: "none" },
                  insideVertical: { style: "none" }, // Ensure no vertical lines inside the table
                  insideHorizontal: { style: "none" }, // Ensure no horizontal lines inside the table
                },
              }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: "none" },
              bottom: { style: "none" },
              left: { style: "none" },
              right: { style: "none" },
              insideVertical: { style: "none" }, // Ensure no vertical lines inside the table
              insideHorizontal: { style: "none" }, // Ensure no horizontal lines inside the table
            },
          }),
        ],
      },
      ...(printCount <= 0
        ? [
            {
              properties: {
                page: {
                  margin: {
                    top: 500, // 0.5 cm in twips
                    bottom: 500, // 0.5 cm in twips
                    left: 800, // 1.27 cm in twips
                    right: 800, // 1.27 cm in twips
                  },
                },
              },
              children: [firstTable, divider, secondTable],
            },
          ]
        : []),
      ...(annexure
        ? [
            {
              properties: {
                page: {
                  margin: {
                    top: 500, // 0.5 cm in twips
                    bottom: 500, // 0.5 cm in twips
                    left: 800, // 1.27 cm in twips
                    right: 800, // 1.27 cm in twips
                  },
                },
              },
              children: [header, title, table],
            },
          ]
        : []),
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Contract_${data.contractNo ? data.contractNo : data._id}.docx`);
};
const workLogdocx = async (data) => {
  const { contractNo, billToAddress, shipToAddress, _id } = data;
  // Generate QR Code as Base64

  // Convert Base64 to Uint8Array
  const qrCodeUint8Array = await qrCodeUint8Arrayfn(_id);
  // Function to create a cell with borders
  const createCell = (content, width) => {
    return new TableCell({
      children: [new Paragraph(content)],
      width: {
        size: width,
        type: WidthType.PERCENTAGE,
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
      },
    });
  };

  // First table (unchanged)
  const firstTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph(`Contract No: ${contractNo}`),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Client: ${billToAddress.prefix} ${billToAddress.name}`,
                    bold: true,
                    size: 20,
                  }),
                ],
              }),
              ...emptyParagraph(1),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: qrCodeUint8Array,
                    transformation: {
                      width: 76, // Width in pixels for 2 cm
                      height: 76, // Height in pixels for 2 cm
                    },
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: {
              size: 40,
              type: WidthType.PERCENTAGE,
            },
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE }, // Adjust to fit your needs
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Ship TO",
                    bold: true,
                    size: 20,
                  }),
                  new TextRun({
                    text: "Address ",
                    bold: true,
                    size: 20,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\t: ${shipToAddress.projectName}`,
                    bold: true,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\t ${shipToAddress.a1}, ${shipToAddress.a2},`,
                    size: 18,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\t ${shipToAddress.a3},`,
                    size: 18,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\t ${shipToAddress.a4},`,
                    size: 18,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\t ${shipToAddress.city} - ${shipToAddress.pincode}`,
                    size: 18,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\t ${shipToAddress.a5}`,
                    size: 18,
                    break: 1,
                  }),
                ],
                tabStops: [
                  {
                    type: AlignmentType.LEFT,
                    position: 1500,
                  },
                ],
                spacing: {
                  after: 300,
                },
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Divider paragraph (unchanged)
  const divider = new Paragraph({
    text: "",
    spacing: {
      before: 200,
      after: 200,
    },
  });

  // Function to create an empty row
  const createEmptyRow = () => {
    return new TableRow({
      children: Array(8)
        .fill()
        .map(() => createCell("", 12.5)),
      height: {
        value: 480,
        rule: HeightRule.ATLEAST,
      },
    });
  };

  // Second table with stretched columns
  const secondTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      new TableRow({
        children: [
          createCell("Date", 10),
          createCell("Executive Name", 12),
          createCell("Area Treated", 12),
          createCell("Structure Name", 9),
          createCell("Chemical Used", 10),
          createCell("Chemical Left @ site", 12),
          createCell("Chemical Packaging", 12),
          createCell("Notes", 25),
        ],
      }),
      // Add empty rows to stretch the table
      ...Array(25)
        .fill()
        .map(() => createEmptyRow()),
    ],
  });

  // Return the tables and divider
  return { firstTable, divider, secondTable };
};

// Function to create the Contract Card
const createContractCard = async (data) => {
  const { contractNo, billToAddress, shipToAddress, quoteInfo, _id } = data;
  const noBorders = {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.NONE },
    insideVertical: { style: BorderStyle.NONE },
  };
  const createParagraph = (text, alignment, isBold = false, size = 18) => {
    return new Paragraph({
      children: [new TextRun({ text, bold: isBold, size })],
      alignment: alignment,
    });
  };
  const qrCodeUint8Array = qrCodeUint8Arrayfn(_id);
  const elementWidth = 13 * 566.9;

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
              top: 230, // 0.3 cm
              bottom: 500,
              left: 230, // 1 cm in twips
              right: 3569, // 1 cm in twips
            },
          },
        },
        children: [
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 3753, type: WidthType.DXA },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Service Card No ${
                              contractNo ? contractNo : _id.slice(15)
                            }`,
                            bold: true,
                          }),
                          new TextRun({
                            text: "                     ",
                          }),
                          new TextRun({
                            text: "Chemical:- ",
                            bold: true,
                          }),
                          ...quoteInfo.map(
                            (obj) =>
                              new TextRun({
                                text: `${obj.chemical} `,
                                bold: true,
                              })
                          ),
                        ],
                        alignment: AlignmentType.LEFT,
                      }),
                    ],
                  }),
                ],
              }),
            ],
            width: { size: elementWidth, type: WidthType.DXA },
            borders: noBorders,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PRE CONTRUCTION-ANTI TERMITE TREATMENT",
                bold: true,
                size: 18,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
            width: { size: elementWidth, type: WidthType.DXA },
          }),
          // Client, Project, and Address Details
          ...emptyParagraph(6),
          new Paragraph({
            children: [
              new TextRun({
                text: "CLIENT   ",
                bold: true,
                size: 18,
              }),
              new TextRun({
                text: `\t: ${billToAddress.prefix} ${billToAddress.name},`,
                bold: true,
                size: 18,
              }),
            ],
            tabStops: [
              {
                type: AlignmentType.LEFT,
                position: 1500,
              },
            ],
          }),
          ...emptyParagraph(1),
          new Paragraph({
            children: [
              new TextRun({
                text: "PROJECT   ",
                size: 18,
                bold: true,
              }),
              new TextRun({
                text: `\t: ${shipToAddress.projectName},`,
                bold: true,
              }),
            ],
            tabStops: [
              {
                type: AlignmentType.LEFT,
                position: 1500,
              },
            ],
          }),
          ...emptyParagraph(1),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE }, // Adjust to fit your needs
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Ship TO",
                            bold: true,
                            size: 20,
                          }),
                          new TextRun({
                            text: "Address ",
                            bold: true,
                            size: 20,
                            break: 1,
                          }),
                          new TextRun({
                            text: `\t: ${shipToAddress.a1}, ${shipToAddress.a2},`,
                            size: 18,
                          }),
                          new TextRun({
                            text: `\t ${shipToAddress.a3},`,
                            size: 18,
                            break: 1,
                          }),
                          new TextRun({
                            text: `\t ${shipToAddress.a4},`,
                            size: 18,
                            break: 1,
                          }),
                          new TextRun({
                            text: `\t ${shipToAddress.city} - ${shipToAddress.pincode}`,
                            size: 18,
                            break: 1,
                          }),
                          new TextRun({
                            text: `\t ${shipToAddress.a5}`,
                            size: 18,
                            break: 1,
                          }),
                        ],
                        tabStops: [
                          {
                            type: AlignmentType.LEFT,
                            position: 1500,
                          },
                        ],
                        spacing: {
                          after: 300,
                        },
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE }, // Width in centimeters for the image column
                    children: [
                      new Paragraph({
                        children: [
                          new ImageRun({
                            data: qrCodeUint8Array,
                            transformation: {
                              width: 76, // Width in pixels for 2 cm
                              height: 76, // Height in pixels for 2 cm
                            },
                          }),
                        ],
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
              }),
            ],
            width: { size: elementWidth, type: WidthType.DXA },
            borders: noBorders,
          }),
          ...emptyParagraph(6),
          // Site Contact Details Table
          createParagraph("ShipTo Contact Details", true, AlignmentType.LEFT),
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: "CONTACT PERSON", bold: true }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: "TELEPHONE", bold: true }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: "EMAIL", bold: true })],
                  }),
                ],
              }),
              ...shipToAddress.kci.map(
                (info) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: `${info.name}` })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `${info.contact}` })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `${info.email}` })],
                      }),
                    ],
                  })
              ),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
            width: { size: elementWidth, type: WidthType.DXA },
            alignment: AlignmentType.LEFT,
          }),
          ...emptyParagraph(1),
          // Final Small Table
          createParagraph(
            "Area details & service charges",
            true,
            AlignmentType.LEFT
          ),
          new Table({
            rows: [
              new TableRow({
                children: [
                  // Cell C1 (75% width)
                  new TableCell({
                    children: [
                      new Table({
                        width: {
                          size: 100,
                          type: WidthType.PERCENTAGE,
                        },
                        rows: [
                          ...quoteInfo.map(
                            (info) =>
                              new TableRow({
                                children: [
                                  new TableCell({
                                    children: [
                                      createParagraph(info.workAreaType),
                                    ],
                                    width: {
                                      size: 45,
                                      type: WidthType.PERCENTAGE,
                                    },
                                  }),
                                  new TableCell({
                                    children: [...emptyParagraph(1)],
                                    width: {
                                      size: 10,
                                      type: WidthType.PERCENTAGE,
                                    },
                                  }),
                                  new TableCell({
                                    children: [
                                      createParagraph(
                                        `${info.workArea} ${info.workAreaUnit}`
                                      ),
                                    ],
                                    width: {
                                      size: 45,
                                      type: WidthType.PERCENTAGE,
                                    },
                                  }),
                                ],
                              })
                          ),
                          ...emptyRows(
                            quoteInfo.length === 2
                              ? 1
                              : quoteInfo.length === 1
                              ? 2
                              : quoteInfo.length === 3
                              ? 0
                              : 0
                          ),
                        ],
                      }),
                    ],
                    borders: noBorders,
                    width: { size: 5527, type: WidthType.DXA },
                  }),

                  // Cell C2 (25% width) with nested table
                  new TableCell({
                    children: [
                      // Define nested table inside C2
                      new Table({
                        rows: [
                          // Row R1
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [
                                  new Table({
                                    rows: [
                                      new TableRow({
                                        children: [
                                          new TableCell({
                                            children: [
                                              createParagraph("IMIDA"),
                                            ],
                                          }),
                                          new TableCell({
                                            children: [
                                              createParagraph("1:475"),
                                            ],
                                          }),
                                        ],
                                      }),
                                      new TableRow({
                                        children: [
                                          new TableCell({
                                            children: [createParagraph("CPP")],
                                          }),
                                          new TableCell({
                                            children: [createParagraph("1:19")],
                                          }),
                                        ],
                                      }),
                                      new TableRow({
                                        children: [
                                          new TableCell({
                                            children: [
                                              createParagraph(
                                                "Drawing",
                                                AlignmentType.CENTER
                                              ),
                                            ],
                                            columnSpan: 2,
                                          }),
                                        ],
                                      }),
                                      new TableRow({
                                        children: [
                                          new TableCell({
                                            children: [
                                              createParagraph(
                                                "Recd",
                                                AlignmentType.CENTER
                                              ),
                                            ],
                                          }),
                                          new TableCell({
                                            children: [
                                              createParagraph(
                                                "Not Recd",
                                                AlignmentType.CENTER
                                              ),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                    width: {
                                      size: 100,
                                      type: WidthType.PERCENTAGE,
                                    },
                                  }),
                                ],
                                borders: noBorders,
                                verticalAlign: VerticalAlign.CENTER,
                              }),
                            ],
                            borders: noBorders,
                          }),
                        ],
                        borders: noBorders,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                      }),
                    ],
                    borders: noBorders,
                    width: { size: 1842, type: WidthType.DXA },
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ],
              }),
            ],
            borders: noBorders,
            width: { size: elementWidth, type: WidthType.DXA },
          }),
          ...emptyParagraph(1),
        ],
      },
    ],
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Card_${data.contractNo ? data.contractNo : data._id}.docx`);
};

function getQuoteInfoTable(docType, quoteInfo) {
  switch (docType) {
    case "standard":
      return createQuoteInfoTableStandard(quoteInfo);
    case "supply":
      return createQuoteInfoTableSupply(quoteInfo);
    default:
      return createQuoteInfoTableApplySupply(quoteInfo);
  }
}

function emptyParagraph(num) {
  let paraArray = [];
  for (let i = 1; i <= num; i++) {
    paraArray.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "",
          }),
        ],
      })
    );
  }
  return paraArray;
}
function emptyRows(num) {
  let paramArray = [];
  for (let i = 1; i <= num; i++) {
    paramArray.push(
      new TableRow({
        children: [
          new TableCell({
            children: [...emptyParagraph(1)],
            width: {
              size: 40,
              type: WidthType.PERCENTAGE,
            },
          }),
          new TableCell({
            children: [...emptyParagraph(1)],
            width: {
              size: 20,
              type: WidthType.PERCENTAGE,
            },
          }),
          new TableCell({
            children: [...emptyParagraph(1)],
            width: {
              size: 40,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      })
    );
  }
  return paramArray;
}

export {
  generateStandardDoc,
  generateSupplyDoc,
  generateSupplyApplyDoc,
  generateStandardContractAdv,
  createQuoteInfoTableApplySupply,
  createQuoteInfoTableStandard,
  createQuoteInfoTableSupply,
  createContractCard,
  workLogdocx,
};
