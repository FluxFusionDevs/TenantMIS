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
  id?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
}
const paddingSizes = {
  xs: "p-2",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-10",
};

type MultiCardProps = {
  data: CardData[]
  direction: "row" | "column"
  padding?: keyof typeof paddingSizes
}



export function MultiCard({ data, direction, padding = "md" }: MultiCardProps) {
  return (
    <div className={`grid gap-4 ${direction === "row" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-rows-1"}`}>
      {data.map((item) => (
        <Card key={item.id}>
          {item.title || item.description ? (
            <CardHeader>
              <CardTitle className="truncate">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          ) : null}
          <CardContent className={paddingSizes[padding]}>
            {item.content}
          </CardContent>
          { item.footer &&
          <CardFooter className="flex justify-between">
            {item.footer}
          </CardFooter>
          }
        </Card>
      ))}
    </div>
  )
}