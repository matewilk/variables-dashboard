import React from "react";
import { render, screen, fireEvent, waitFor } from "test-utils";

import { MultiSelect } from "../../components/MultiSelect";

describe("MultiSelect", () => {
  let initialOptions = [];
  let placeholder;
  beforeEach(() => {
    placeholder = "Cluster";
    initialOptions = [
      { value: "value 1", label: "label 1" },
      { value: "value 2", label: "label 2" },
    ];

    waitFor(() => render(
      <MultiSelect placeholder={placeholder} initialOptions={initialOptions} />
    ));
  });

  it("displays multi select dropdown", () => {
    expect(screen.queryByText(placeholder)).toBeTruthy();
  });

  it("displays initial options", async () => {
    fireEvent.mouseDown(screen.getByText(placeholder), {});

    expect(await screen.queryByText("label 1")).toBeTruthy();
    expect(screen.getByText("label 2")).toBeTruthy();
  });

  it("displays async options", async () => {
    fireEvent.mouseDown(screen.getByText(placeholder), {});

    await screen.findByText("label 3")
    expect(screen.findByText("label 4")).toBeTruthy();
  });
});
