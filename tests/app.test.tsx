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
    expect(markup).toContain('aria-label="Search tickets"');
    expect(markup).toContain('aria-label="Compact inbox navigation"');
    for (const target of ['queue', 'queue-views', 'customer-context', 'tag-guide', 'automation-guide', 'desk-settings']) {
      expect(markup).toContain(`id="${target}"`);
      expect(markup).toContain(`href="#${target}"`);
    }
    expect(markup).toContain('LOCAL PREVIEW');
    expect(markup).toContain('Preview reply');
  });
});
