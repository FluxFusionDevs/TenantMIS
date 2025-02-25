import { Flow, Params } from "react-chatbotify";

export const financeManagerFaqs: Flow = {
  start: {
    chatDisabled: true,
    message: "Hello! I'm here to help you answer your questions.",
    options: [
      "How do I generate a financial report?",
      "How do I view specific expenses or revenues?",
      "How do I view reports on past periods?",
    ],
    path: (params: Params) => {
      switch (params.userInput) {
        case "How do I generate a financial report?":
          return "generate_financial_report";
        case "How do I view specific expenses or revenues?":
          return "view_specific_expenses_or_revenues";
        case "How do I view reports on past periods?":
          return "view_reports_past_periods";
        default:
          return "start"; // Fallback path
      }
    },
  },
  generate_financial_report: {
    chatDisabled: true,
    message: `To generate a financial report, go to the Reports section. Choose the type of report you need, such as a Revenue Report, Expense Report, or Transactions Report. After selecting the report type, click the Generate Report button. You will be able to customize the report by choosing the relevant date range and categories before downloading or saving the report.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  view_specific_expenses_or_revenues: {
    chatDisabled: true,
    message: `To see detailed information on specific expenses or revenues, navigate to the Finance View Transaction section. There, you can filter by Revenue or Expense categories. Each entry will show details like transaction amount, date, and category.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  view_reports_past_periods: {
    chatDisabled: true,
    message: `To view past-period financial reports, use the Reports section to filter by date range (e.g., monthly, quarterly, yearly). This will allow you to generate reports for specific periods, whether it's for Revenue, Expenses, or Transactions.`,
    options: ["Is there anything else you need help with?"],
    path: "end",
  },
  end: {
    chatDisabled: true,
    message: "Is there anything else I can assist you with?",
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