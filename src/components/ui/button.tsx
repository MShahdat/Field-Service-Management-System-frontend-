import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        // Status button variants (No partial background fills, solid on hover)
        // Status button variants — solid, shade shifts on hover
        requested:
          "border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md focus-visible:border-amber-600 focus-visible:ring-amber-500/30 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300",
        inProgress:
          "border-transparent bg-blue-500 text-white shadow-sm hover:bg-blue-600 hover:shadow-md focus-visible:border-blue-600 focus-visible:ring-blue-500/30 dark:bg-blue-400 dark:text-blue-950 dark:hover:bg-blue-300",
        declined:
          "border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-md focus-visible:border-red-600 focus-visible:ring-red-500/30 dark:bg-red-400 dark:text-red-950 dark:hover:bg-red-300",
        paid: "border-transparent bg-purple-500 text-white shadow-sm hover:bg-purple-600 hover:shadow-md focus-visible:border-purple-600 focus-visible:ring-purple-500/30 dark:bg-purple-400 dark:text-purple-950 dark:hover:bg-purple-300",
        accepted:
          "border-transparent bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md focus-visible:border-emerald-700 focus-visible:ring-emerald-600/30 dark:bg-emerald-400 dark:text-emerald-950 dark:hover:bg-emerald-300",
        completed:
          "border-transparent bg-gray-500 text-white shadow-sm hover:bg-gray-600 hover:shadow-md focus-visible:border-gray-600 focus-visible:ring-gray-500/30 dark:bg-gray-400 dark:text-gray-950 dark:hover:bg-gray-300",
        cancelled:
          "border-transparent bg-red-700 text-white shadow-sm hover:bg-red-800 hover:shadow-md focus-visible:border-red-800 focus-visible:ring-red-700/30 dark:bg-red-500 dark:text-red-950 dark:hover:bg-red-400",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
