import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";

describe("Navbar Component", () => {
  test("renders logo and user profile", () => {
    render(<Navbar />);
    const logoElement = screen.getByAltText(/logo/i);
    expect(logoElement).toBeInTheDocument();

    const userProfile = screen.getByText(/Mark Divan/i);
    expect(userProfile).toBeInTheDocument();
  });
});
