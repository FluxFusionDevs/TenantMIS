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
  className?: string
}



export function MultiCard({ data, direction, padding = "md", className }: MultiCardProps) {
  return (
    <div className={`flex gap-4 ${direction === "row" ? "flex-row overflow-x-auto" : "flex-col"} ${className}`}>
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