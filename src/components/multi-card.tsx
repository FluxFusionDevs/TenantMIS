import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type CardData = {
  id?: string | number  
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

const sizes = {
  auto: "w-auto",
  xs: "w-[100px]",
  sm: "w-[200px]",
  md: "w-[300px]",
  lg: "w-[350px]",
};

type MultiCardProps = {
  data: CardData[]
  direction: "row" | "column"
  padding?: keyof typeof paddingSizes
  className?: string,
  size?: keyof typeof sizes
}

export function MultiCard({ data, direction, padding = "md", className, size = "auto" }: MultiCardProps) {
  return (
    <div className={`flex gap-4 ${direction === "row" ? "flex-row flex-wrap" : "flex-col"} ${className}`}>
      {data.map((item) => (
        <Card key={item.id} className={sizes[size]}>
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