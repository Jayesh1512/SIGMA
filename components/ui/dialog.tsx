"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {}

export function Dialog({ children, ...props }: DialogProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

export function DialogTrigger({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger
      {...props}
      className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
    >
      {children}
    </DialogPrimitive.Trigger>
  );
}

export function DialogContent({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30" />
      <DialogPrimitive.Content
        {...props}
        className={cn(
          "fixed left-[50%] top-[50%] w-[90vw] max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg",
          className
        )}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-200 focus:outline-none">
          <X className="w-5 h-5 text-gray-500" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ title, description, className, ...props }) {
  return (
    <div {...props} className={cn("border-b pb-4 mb-4", className)}>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export function DialogFooter({ onCancel, onConfirm, className, ...props }) {
  return (
    <div {...props} className={cn("flex justify-end gap-2 mt-4", className)}>
      <button onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
      <button onClick={onConfirm} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Confirm</button>
    </div>
  );
}

export function DialogTitle({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      {...props}
      className={cn("text-lg font-semibold text-gray-900", className)}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      {...props}
      className={cn("text-sm text-gray-600 mt-2", className)}
    >
      {children}
    </DialogPrimitive.Description>
  );
}
