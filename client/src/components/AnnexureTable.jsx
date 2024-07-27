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
} from "docx";
import { fetchImage } from "../funtions/funtion";
import headerImage from "../images/header.png";

const generateStandardDoc = async (data) => {
  console.log(data);
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
                text: `${item.serviceRate + " " + item.serviceRateUnit}`,
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

export { generateStandardDoc, generateSupplyDoc, generateSupplyApplyDoc };
