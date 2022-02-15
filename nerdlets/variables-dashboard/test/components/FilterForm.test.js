import React from "react";
import { render, screen, waitFor } from "test-utils";

import { FilterForm } from "../../components/FilterForm";

describe("FilterForm", () => {
  beforeEach(() => waitFor(() =>render(<FilterForm />)));

  it("is a form element", () => {
      expect(screen.getByRole('form')).toBeTruthy();
  });

  it("contains submit button", () => {
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it("contains Cluster multi dropdown", () => {
    expect(screen.queryByText("Cluster")).toBeTruthy();
  });
});
