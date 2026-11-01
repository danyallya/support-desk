export function makeTicketUpsertData({ messages, ...ticket }) {
  const { id, ...update } = ticket;
  return { id, update, create: ticket, messages };
}

export function makeMessageUpsertData(message, ticketId) {
  const { id, ...update } = message;
  return {
    id,
    update: { ...update, ticketId },
    create: { ...message, ticketId },
  };
}
