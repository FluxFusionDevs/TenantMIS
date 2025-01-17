import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type CardData = {
  id: string | number
  title: string
  description?: string
  content: React.ReactNode
  footer?: React.ReactNode
}

type MultiCardProps = {
  data: CardData[]
  direction: "row" | "column"
}

export function MultiCard({ data, direction }: MultiCardProps) {
  return (
    <div className={`grid gap-4 ${direction === "row" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-rows-1"}`}>
      {data.map((item) => (
        <Card key={item.id} className="w-[350px]">
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {item.content}
          </CardContent>
          <CardFooter className="flex justify-between">
            {item.footer}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}