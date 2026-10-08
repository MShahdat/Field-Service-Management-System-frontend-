export const statusVarient = (s: string) => {
  switch (s) {
    case "COMPLETED":
      return "accepted" as const;
    case "PENDING":
    case "MEDIUM":
    case "SCHEDULED":
      return "requested" as const;
    case "APPROVED":
    case "ASSIGMED":
    case "IN_PROGRESS":
    case "EN_ROUTE":
    case "STARTED":
      return "inProgress" as const;
    case "REJECTED":
    case "CANCELLED":
    case "HIGH":
    case "URGENT":
      return "declined" as const;
    case "LOW":
      return "completed" as const;
    default:
      return "secondary" as const;
  }
};

export const badgeText = (s: string) => {
  return s
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
