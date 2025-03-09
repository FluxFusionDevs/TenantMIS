import { Flow, Params } from "react-chatbotify";

export const tenantManagerFaqs: Flow = {
    start: {
      chatDisabled: true,
      message: "Hello! I'm here to help you answer your questions.",
      options: [
        "How can I view the contracts of current tenants?",
        "How can I make a purchase orders?",
        "How can I manage overdue payments?",
        "How do I update tenant details?",
        "How do I notify tenants about issues or updates?",
        "How do I track contracts nearing expiration?",
      ],
      path: (params: Params) => {
        switch (params.userInput) {
          case "How can I view the contracts of current tenants?":
            return "view_contracts";
          case "How can I make a purchase orders?":
            return "make_purchase_orders";
          case "How can I manage overdue payments?":
            return "manage_overdue_payments";
          case "How do I update tenant details?":
            return "update_tenant_details";
          case "How do I notify tenants about issues or updates?":
            return "notify_tenants";
          case "How do I track contracts nearing expiration?":
            return "track_contracts_expiration";
          default:
            return "start"; // Fallback path
        }
      },
    },
    view_contracts: {
      chatDisabled: true,
      message: `In the "Contracts" section, you will see a list of all tenant contracts. You can monitor active contracts, check upcoming contract renewals, or review any pending contracts. For detailed information on a specific contract, click on the tenant's name to view the lease agreement, start and end dates, and terms. You can also track the contract status and renewals.`,
      options: ["Is there anything else you need help with?"],
      path: "end",
    },
    make_purchase_orders: {
      chatDisabled: true,
      message: `In the "Purchase Orders" section, you can add new purchase orders by clicking the "Add New Purchase Order" button. You can also view the status of existing orders (e.g., pending, approved, denied). For each purchase order, you can review details, approve or deny the request, and track its status.`,
      options: ["Is there anything else you need help with?"],
      path: "end",
    },
    manage_overdue_payments: {
      chatDisabled: true,
      message: `The "Bills and Payments" section lets you view overdue payments and notify tenants directly. You can also review the payment history for each tenant and follow up on any missed or overdue payments.`,
      options: ["Is there anything else you need help with?"],
      path: "end",
    },
    update_tenant_details: {
      chatDisabled: true,
      message: `To update a tenant’s details, go to the "Tenants" section, search for the tenant, and click on their name. From there, you can edit contact information, change the status, or add comments to the tenant's profile.`,
      options: ["Is there anything else you need help with?"],
      path: "end",
    },
    notify_tenants: {
      chatDisabled: true,
      message: `To notify a tenant, go to their profile under "Tenants" or navigate to their complaint, contract, or payment page. Use the "Notify" button to send updates or reminders to tenants about their complaints, payments, or lease renewals.`,
      options: ["Is there anything else you need help with?"],
      path: "end",
    },
    track_contracts_expiration: {
      chatDisabled: true,
      message: `In the "Contracts" section, contracts nearing expiration will show a warning or notification indicating the remaining days until renewal. You can click on any contract for detailed information and reminders about upcoming renewals.`,
      options: ["Is there anything else you need help with?"],
      path: "end",
    },
    end: {
      chatDisabled: true,
      options: ["Yes, I have another question.", "No, that's all for now."],
      path: (params: Params) => {
        if (params.userInput === "Yes, I have another question.") {
          return "start";
        } else {
          return "goodbye";
        }
      },
    },
    goodbye: {
      message: "Thank you! Have a great day!",
      chatDisabled: true,
    },
  };