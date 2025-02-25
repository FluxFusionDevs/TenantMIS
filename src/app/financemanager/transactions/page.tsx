import { MultiCard } from "@/components/multi-card";

const cardData = [
    {
      id: "1",
      content: (
        <div>
          <h2 className="text-xl font-semibold text-muted-foreground">Category</h2>
            <h1 className="text-2xl font-medium">Revenue Report</h1>
            <p className="text-muted-foreground">Created by: John Doe</p>
            <p className="text-muted-foreground">Date: 12/12/2021</p>
        </div>
      )
    },
    {
        id: "2",
        content: (
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">Category</h2>
              <h1 className="text-2xl font-medium">Expense Report</h1>
              <p className="text-muted-foreground">Created by: Jane Doe</p>
              <p className="text-muted-foreground">Date: 12/12/2021</p>
          </div>
        )

    },
    {
        id: "3",
        content: (
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">Category</h2>
              <h1 className="text-2xl font-medium">Revenue Report</h1>
              <p className="text-muted-foreground">Created by: John Doe</p>
              <p className="text-muted-foreground">Date: 12/12/2021</p>
          </div>
        )

    },
    {
        id: "4",
        content: (
          <div>
            <h2 className="text-xl font-semibold text-muted-foreground">Category</h2>
              <h1 className="text-2xl font-medium">Expense Report</h1>
              <p className="text-muted-foreground">Created by: Jane Doe</p>
              <p className="text-muted-foreground">Date: 12/12/2021</p>
          </div>
        )

    }

  ];

  const createReportButton = [
    {
      id: "1",
      content: (
        <div>
            <h1 className="text-2xl font-medium">Leaky Faucet</h1>
            <p>ID# 4234324</p>
            <p className="text-muted-foreground">Generate a report based on total revenue during an allotted time</p>
        </div>
      )
    },
    {
      id : "2",
      content: (
        <div>
            <h1 className="text-2xl font-medium">Broken Window</h1>
            <p>ID# 4234324</p>
            <p className="text-muted-foreground">Generate a report based on total revenue during an allotted time</p>
        </div>
      )
    }
  ]

export default function Page() {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold opacity-80">Transactions Management</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">Recent Transactions</h2>

        <div className="overflow-x-auto whitespace-nowrap">
        <MultiCard data={cardData} direction="row"/>
        </div>

        <h2 className="text-2xl font-semibold text-muted-foreground">All Transactions</h2>
        <MultiCard data={createReportButton} direction="column"/>
      </div>
    );
  }