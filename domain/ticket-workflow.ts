export type TicketStatus = "Open" | "Pending" | "Resolved" | "Closed";

const allowedTransitions: Record<TicketStatus, readonly TicketStatus[]> = {
  Open: ["Pending", "Resolved", "Closed"],
  Pending: ["Open", "Resolved", "Closed"],
  Resolved: ["Open", "Closed"],
  Closed: ["Open"],
};

export function transitionTicket<T extends { state: TicketStatus }>(
  ticket: T,
  nextState: TicketStatus,
): Omit<T, "state"> & { state: TicketStatus } {
  if (ticket.state === nextState) return ticket;
  if (!allowedTransitions[ticket.state].includes(nextState)) {
    throw new Error(`Cannot transition ticket from ${ticket.state} to ${nextState}.`);
  }

  return { ...ticket, state: nextState };
}
