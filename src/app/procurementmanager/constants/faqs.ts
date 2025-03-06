import { Flow, Params } from "react-chatbotify";

export const procurementManagerFaqs: Flow = {
  start: {
    chatDisabled: true,
    message: "Hello! I'm here to help you answer your questions.",
    options: [
      "How do I view and manage procurement requests?",
      "How do I submit a new procurement request?",
      "How can I track the status of a procurement request?",
    ],
    path: (params: Params) => {
      switch (params.userInput) {
        case "How do I view and manage procurement requests?":
          return "view_manage_procurement_requests";
        case "How do I submit a new procurement request?":
          return "submit_procurement_request";
        case "How can I track the status of a procurement request?":
          return "track_procurement_status";
        default:
          return "start"; // Fallback path
      }
    },
  },
  view_manage_procurement_requests: {
    chatDisabled: true,
    message: `To view and manage procurement requests, navigate to the "Procurement Requests" section. Here, you will find a list of all requests. You can search for specific items, filter by status (e.g., "In Progress," "Approved," "Denied"), and click on any request to see more details. You can also track the real-time status of each request.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  submit_procurement_request: {
    chatDisabled: true,
    message: `To submit a new procurement request, click the "New Request" section and click the "Procurement Requests" button. You will be asked to provide the details of the item(s) needed, including a description and any specifications. Once submitted, the request will go through an approval process.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  track_procurement_status: {
    chatDisabled: true,
    message: `You can track the status of procurement requests in real-time by checking the "Real-Time Tracking" section. This will show the current stage of each request and its workflow status (e.g., "Pending," "In Progress," "Approved"). You can also view any updates made to the request.`,
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