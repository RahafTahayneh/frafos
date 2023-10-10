import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Card from "./Card";

const meta: Meta = {
  title: "Example/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Card Label",
    value: "100",
  },
};

export const Secondary: Story = {
  args: {
    label: "Card Label",
    value: "50",
  },
};
