import Dropdown from "../components/Dropdown";
import React from "react";
import { createRoot } from "react-dom";

let container: HTMLDivElement | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) {
    container.remove();
  }
  container = null;
});

it("renders without crashing", () => {
  if (container) {
    const root = createRoot(container);
    root.render(
      <Dropdown options={["Option 1", "Option 2"]} label="Test Label" />
    );
  }
});
