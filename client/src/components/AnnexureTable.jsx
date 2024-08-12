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
} from "docx";
import { saveAs } from "file-saver";
import { fetchImage } from "../funtions/funtion";
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
                  spacing: {
                    before: 120, // Space before the paragraph (in twips)
                    after: 120, // Space after the paragraph (in twips)
                    line: 200, // Line spacing (1.5 line spacing in twips)
                  },
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
                      spacing: {
                        before: 120, // Space before the paragraph (in twips)
                        after: 120, // Space after the paragraph (in twips)
                        line: 200, // Line spacing (1.5 line spacing in twips)
                      },
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
    billToAddress,
    shipToAddress,
    paymentTerms,
    workOrderNo,
    workOrderDate,
    createdAt,
    gstNo,
    taxation,
  } = data;
  console.log(data);
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
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
                            text: `${billToAddress.prefix} ${billToAddress.name}`,
                            bold: true,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.a2}, ${billToAddress.a1}`,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${billToAddress.a3}, ${billToAddress.a4}, ${billToAddress.a5}`,
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
                      ...(workOrderDate
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
                            text: `Contract Date     :${formatDate(createdAt)}`,
                          }),
                        ],
                      }),
                      new Paragraph({ text: "" }),
                      new Paragraph({ text: "" }),
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
                    ],
                  }),
                ],
              }),
            ],
            width: { size: 10000, type: WidthType.DXA },
          }),
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
              right: 300,
            },
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
                            text: "PAYMENT TERMS",
                            bold: true,
                          }),
                          new TextRun({
                            text: `\t: ${paymentTerms}`,
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
                            text: "Guarantee",
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
                          start: 3000, // Adjust this value to control indentation
                        },
                      }),
                      new Paragraph({ text: "" }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Measure",
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
            width: { size: 10000, type: WidthType.DXA },
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
                            text: `${shipToAddress.a2} ${shipToAddress.a1}`,
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
                            text: shipToAddress.a5,
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
                      ...(shipToAddress.kci.length > 0
                        ? [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: "Site Contact Person :-",
                                  bold: true,
                                }),
                              ],
                            }),
                          ]
                        : []),
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
            width: { size: 10000, type: WidthType.DXA },
          }),
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
                    width: { size: 5000, type: WidthType.DXA }, // Fixed width for left cell
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
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "",
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Authorized Signatory",
                            bold: true,
                          }),
                          new TextRun({
                            text: `${data.createdBy.initials}/${data.salesPerson.initials}`,
                            break: 1, // Insert a line break between TextRuns
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
                    borders: {
                      top: { style: "none" },
                      bottom: { style: "none" },
                      left: { style: "none" },
                      right: { style: "none" },
                    },
                  }),
                  new TableCell({
                    width: { size: 5000, type: WidthType.DXA }, // Fixed width for right cell
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
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "(CONTRACTEE)",
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
            width: { size: 10000, type: WidthType.DXA },
            borders: {
              top: { style: "none" },
              bottom: { style: "none" },
              left: { style: "none" },
              right: { style: "none" },
              insideVertical: { style: "none" }, // Ensure no vertical lines inside the table
              insideHorizontal: { style: "none" }, // Ensure no horizontal lines inside the table
            },
          }),
          ...(gstNo && gstNo.trim() !== ""
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "GST No.",
                      bold: true,
                      size: 24,
                    }),
                    new TextRun({
                      text: gstNo,
                      bold: true,
                      size: 24,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ]
            : []),
        ],
      },
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
  saveAs(blob, "standard_contract.docx");
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
export {
  generateStandardDoc,
  generateSupplyDoc,
  generateSupplyApplyDoc,
  generateStandardContractAdv,
  createQuoteInfoTableApplySupply,
  createQuoteInfoTableStandard,
  createQuoteInfoTableSupply,
};
