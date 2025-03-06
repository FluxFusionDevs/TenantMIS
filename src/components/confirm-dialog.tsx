"use client";

import React, { startTransition, useActionState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, Loader2 } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";

export type ActionButton = {
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  showLoaderOnLoading?: boolean; // New prop to control if loader should be shown
  loadingText?: string; // Optional alternative text to show when loading
};

interface ConfirmDialogProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionButtons: ActionButton[];
  children: React.ReactNode;
  serverAction?: any;
}

type FormState = {
  success: boolean;
  messages?: string[];
};

const initialState: FormState = {
  success: true,
  messages: [],
};

export function ConfirmDialog({
  title,
  description,
  icon = <AlertTriangleIcon className="h-5 w-5 text-destructive" />,
  children,
  actionButtons,
  serverAction,
}: ConfirmDialogProps) {
  const [state, formAction, pending] = useActionState(
    serverAction,
    initialState
  );
  const [confirmText, setConfirmText] = React.useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {serverAction && (
          <Input
            placeholder="Type the staff name to confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        )}
        <DialogFooter>
          {actionButtons.map((button, index) => {
            // Determine what text to show based on loading state
            const buttonText =
              button.isLoading && button.loadingText
                ? button.loadingText
                : button.label;

            const isButtonLoading =
              button.isLoading ||
              (pending && index === actionButtons.length - 1);

            return (
              <Button
                key={index}
                variant={button.variant || "outline"}
                onClick={
                  button.onClick
                    ? button.onClick
                    : serverAction && index === actionButtons.length - 1
                    ? async () => {
                        // If this is the confirm button and serverAction exists
                        if (confirmText.trim() === title.trim()) {
                          // Wrap formAction in startTransition
                          startTransition(() => {
                            formAction();
                          });
                          toast.success("Action completed successfully.");
                        } else {
                          toast.error("Confirmation text does not match.");
                        }
                      }
                    : undefined
                }
                disabled={button.disabled || isButtonLoading}
              >
                {/* Only show loader if showLoaderOnLoading is true (or undefined) AND isLoading is true */}
                {isButtonLoading && button.showLoaderOnLoading !== false && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {buttonText}
              </Button>
            );
          })}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
