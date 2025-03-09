import { Flow, Params } from "react-chatbotify";

export const staffManagerFaqs: Flow = {
  start: {
    chatDisabled: true,
    message: "Hello! I'm here to help you answer your questions.",
    options: [
      "How do I set schedules?",
      "How can I update requests progress?",
      "How can I change staff details?",
      "How can I see which staff are available for a task?",
      "How can I assign staff to a task?",
    ],
    path: (params: Params) => {
      switch (params.userInput) {
        case "How do I set schedules?":
          return "set_schedules";
        case "How can I update requests progress?":
          return "update_requests_progress";
        case "How can I change staff details?":
          return "change_staff_details";
        case "How can I see which staff are available for a task?":
          return "see_staff_availability";
        case "How can I assign staff to a task?":
          return "assign_staff_to_task";
        default:
          return "start"; // Fallback path
      }
    },
  },
  set_schedules: {
    chatDisabled: true,
    message: `Under a specific schedule from a designated category of staffers, you can be able to select the day of the week, a specific shift from that day, and finally assign sure staff to operate during those hours. Those hours will then be reflected alongside other information on the staff member’s own information page.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  update_requests_progress: {
    chatDisabled: true,
    message: `After creating a request, details such as priority, progress, and priority can easily be changed by clicking on their dropdown menus. Other information, such as specific notes and the staff member assigned, can also be decided on this page.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  change_staff_details: {
    chatDisabled: true,
    message: `After selecting a specific member under housekeeping, maintenance, or security and viewing their complete information, you can edit their details by clicking on the pencil on the right side of the screen.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  see_staff_availability: {
    chatDisabled: true,
    message: `All pages featuring a list of the staff members include a sort and filter function that can be used to search for specific people within the team, including those available at the given moment.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  assign_staff_to_task: {
    chatDisabled: true,
    message: `Under a specific schedule from a designated category of staffers, you can be able to select the day of the week, a specific shift from that day, and finally assign sure staff to operate during those hours. Those hours will then be reflected alongside other information on the staff member's own information page.`,
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