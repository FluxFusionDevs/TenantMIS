"use client";

import React from "react";
import ChatBot, { Flow, Params } from "react-chatbotify";

export default function Page() {
  const [form, setForm] = React.useState({});
  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  };

  const flow: Flow = {
    start: {
      chatDisabled: true,
      message: "Hello! I'm here to help you answer your questions.",
      options: [
        "How do I file a complaint?",
        "What types of complaints can I file?",
        "How do I track my complaint status?",
        "How long does it take to resolve a complaint?",
        "How can I pay for my rent/utilities?",
        "How can I cancel my contract?",
      ],
      path: (params: Params) => {
        switch (params.userInput) {
          case "How do I file a complaint?":
            return "file_complaint";
          case "What types of complaints can I file?":
            return "types_of_complaints";
          case "How do I track my complaint status?":
            return "track_complaint";
          case "How long does it take to resolve a complaint?":
            return "complaint_resolution_time";
          case "How can I pay for my rent/utilities?":
            return "payment_methods";
          case "How can I cancel my contract?":
            return "cancel_contract";
          default:
            return "start"; // Fallback path
        }
      },
    },
    file_complaint: {
      chatDisabled: true,
      message: `To file a complaint, go to the "My Requests" section and click the "+" button to create a new request. You will need to fill in the following details:
          \n● Requestor Name: Enter your full name.
          \n● Contact Number: Provide your contact number for communication.
          \n● Email Address: Input your email address so we can send updates about your request.
          \n● Location: Specify the location related to your complaint, such as your apartment number or area of concern.
          \n● Attach Image: If applicable, you can upload images to illustrate the issue, such as damage, maintenance problems, or other relevant visuals.
          \n● Description: Write a detailed description of the issue you are experiencing. The more information you provide, the better we can address your concern.
          \nOnce all the fields are completed, click the Submit button to file your complaint. If you decide not to proceed, click Cancel to discard your request.`,
      options: ["Is there anything else you need help with?"],
      path: "end",
    },
    types_of_complaints: {
      chatDisabled: true,
      message: "You can file complaints related to maintenance, noise disturbances, security issues, or payment concerns.",
      options: ["Is there anything else you need help with?"],
    
    },
    track_complaint: {
        chatDisabled: true,
        message: `Once your complaint is filed, go to "My Requests" to view your request's status and updates. You can filter by type or check the status of each request.`,
        options: ["Is there anything else you need help with?"],
        path: "end",
      },
      complaint_resolution_time: {
        chatDisabled: true,
        message: `The time to resolve each complaint may vary. You will receive updates in the "Status" section once a resolution timeline is available.`,
        options: ["Is there anything else you need help with?"],
        path: "end",
      },
      payment_methods: {
        chatDisabled: true,
        message: `You can pay for your rent or utilities via online transfer or bank deposit. Please follow these steps to ensure your payment is processed correctly:
        \n● Online Transfer:
        \n1. Log into your online banking platform.
        \n2. Use the account details provided on your billing statement to make the transfer.
        \n3. Include your Statement of Account (SOA) number and the payment period in the payment description.
        \n● Bank Deposit:
        \n1. Visit any branch of our bank partner (BDO & East West).
        \n2. Fill out a deposit slip with the account number provided on your billing statement.
        \n3. Mention your Statement of Account (SOA) number on the slip to ensure the payment is credited to your account.
        \n4. Keep the receipt for your records.
        \nPlease ensure payments are made on or before the due date to avoid any late fees or penalties.`,
        options: ["Is there anything else you need help with?"],
        path: "end",
      },
      cancel_contract: {
        chatDisabled: true,
        message: `To cancel your contract, you are required to provide a 60-day written notice. Please be aware that cancellation of the contract before its expiration will result in the forfeiture of your security deposit.
        \nFollow these steps to initiate the cancellation:
        \n1. Write a formal notice of cancellation stating your intention to terminate the contract.
        \n2. Include your name, leased unit, and the date from which you wish the cancellation to take effect.
        \n3. Submit this notice via email or deliver it to our office to ensure it is received by the property management team.
        \n4. Await confirmation of receipt and any further instructions regarding the final settlement and move-out procedures.
        \nPlease consult the contract terms or contact our leasing department if you need detailed information or assistance regarding specific circumstances that might affect your cancellation terms.`,
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

  return (
    <ChatBot
      settings={{
        tooltip: {  text: "Ask questions!" },
        general: { embedded: false },
        chatHistory: { storageKey: "tenant_complaint_form" },
        footer: { text: "" },
      }}
      flow={flow}
    />
  );
}
