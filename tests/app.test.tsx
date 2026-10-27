import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "../app/page";

describe("support-desk workspace", () => {
  it("renders its initial workspace content", () => {
    const markup = renderToStaticMarkup(createElement(HomePage));
    expect(markup).toContain("Good morning, Alex");
    expect(markup).toContain("NS-2048");
    expect(markup).toContain("Domain verification is stuck");
    expect(markup).toContain("Reply to customer");
  });
});
