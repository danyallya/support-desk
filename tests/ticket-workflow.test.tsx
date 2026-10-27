import { describe, expect, it } from "vitest";
import { transitionTicket } from "../domain/ticket-workflow";

describe("support ticket workflow", () => {
  it("moves open and pending tickets to resolved when requested", () => {
    expect(transitionTicket({ id: "NS-1", state: "Open" }, "Resolved")).toEqual({
      id: "NS-1",
      state: "Resolved",
    });
    expect(transitionTicket({ id: "NS-2", state: "Pending" }, "Resolved").state).toBe(
      "Resolved",
    );
  });

  it("allows reopening a resolved or closed ticket", () => {
    expect(transitionTicket({ state: "Resolved" }, "Open").state).toBe("Open");
    expect(transitionTicket({ state: "Closed" }, "Open").state).toBe("Open");
  });

  it("rejects transitions outside the support workflow", () => {
    expect(() => transitionTicket({ state: "Resolved" }, "Pending")).toThrow(
      "Cannot transition ticket from Resolved to Pending.",
    );
  });
});
