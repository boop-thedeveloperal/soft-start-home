import { Button } from "./button";
import { cn } from "@/lib/utils";

// Large, rounded nurturing button for primary actions
export const NurturingButton = ({ 
  children, 
  className,
  ...props 
}: React.ComponentProps<typeof Button>) => (
  <Button 
    className={cn(
      "h-16 text-lg font-semibold rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300",
      "bg-card hover:bg-accent border-2 border-border",
      className
    )}
    {...props}
  >
    {children}
  </Button>
);

// Gentle action button
export const GentleButton = ({ 
  children, 
  className,
  ...props 
}: React.ComponentProps<typeof Button>) => (
  <Button 
    className={cn(
      "h-14 rounded-full px-6 font-medium shadow-md hover:shadow-lg transition-all duration-300",
      "bg-secondary hover:bg-accent",
      className
    )}
    {...props}
  >
    {children}
  </Button>
);
