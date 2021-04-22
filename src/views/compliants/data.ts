import React from "react";
import { MenuItem } from "../../model/menu-item.model";

export interface LayoutData extends MenuItem {
  route: string;
}

export class Compliant {
  constructor(
    readonly idCompliant: string,
    readonly title: string,
    readonly date: string
  ) {}
}

const data_compliants = [
  {
    id: "001",
    title: "Compliant 001",
    date: "2021-01-01 08:00:00",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut " +
      "labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
      "incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "002",
    title: "Compliant 002",
    date: "2021-01-02 08:00:00",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut " +
      "labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
      "incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "003",
    title: "Compliant 003",
    date: "2021-01-03 08:00:00",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut " +
      "labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
      "incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "004",
    title: "Compliant 004",
    date: "2021-01-04 08:00:00",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut " +
      "labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor " +
      "incididunt ut labore et dolore magna aliqua.",
  },
];

export default data_compliants;
