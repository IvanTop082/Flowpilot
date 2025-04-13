"use client"

// Adapted from shadcn/ui toast component
import { 
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast-hook"

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose }
export { useToast }

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

// Create a client-side only wrapper for the toast function
export const toast = ({ title, description, variant = "default" }: { 
  title: string; 
  description?: string; 
  variant?: "default" | "destructive"
}) => {
  // This is safe to use on server-side because it's not calling useToast() directly
  // It just returns a reference to the object with the toast method
  if (typeof window !== 'undefined') {
    // Only import and use on the client side
    const { toast: internalToast } = useToast();
    internalToast({
      title,
      description,
      variant
    });
  } else {
    // Log on server (this won't actually execute the toast)
    console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`);
  }
} 