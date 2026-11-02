import { describe, expect, it } from "vitest";
import { getPreviewCustomerContext } from "../lib/preview-customer-context";

describe("selected preview ticket customer context", () => {
  it("keeps the customer heading data and team note aligned when tickets change", () => {
    const oliver = getPreviewCustomerContext("NS-2047");
    expect({ heading: "Oliver Grant", ...oliver }).toEqual({
      heading: "Oliver Grant",
      email: "oliver.grant@example.com",
      company: "Northwind Labs",
      plan: "Growth",
      lastSeen: "Today, 9:24 AM",
      note: "Oliver manages billing for Northwind Labs and is reviewing the annual plan for next quarter.",
    });

    const maya = getPreviewCustomerContext("NS-2048");
    expect({ heading: "Maya Chen", ...maya }).toMatchObject({
      heading: "Maya Chen",
      email: "maya.chen@example.com",
      company: "Acme Studio",
      note: expect.stringContaining("Maya"),
    });
    expect(maya?.email).not.toBe(oliver?.email);
    expect(maya?.company).not.toBe(oliver?.company);
    expect(maya?.note).not.toBe(oliver?.note);
  });

  it("returns no context for an unknown ticket instead of another customer's details", () => {
    expect(getPreviewCustomerContext("unknown")).toBeNull();
  });
});
