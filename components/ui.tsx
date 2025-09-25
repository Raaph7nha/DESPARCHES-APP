



import React, { useState, createContext, useContext, forwardRef, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from './Icons';

// --- Utility ---
// FIX: Export cn utility function to be used in other components.
export const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// --- Card ---
export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
);

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);


// --- Input ---
// FIX: Modify Input to be polymorphic using the `as` prop for textarea and select elements.
export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, any>(
    ({ className, type, as, children, ...props }, ref) => {
        const baseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
        
        if (as === 'textarea') {
            // FIX: Cast ref to the specific element type to resolve TypeScript error.
            return <textarea className={cn(baseClasses, "h-24", className)} ref={ref as React.Ref<HTMLTextAreaElement>} {...props} />;
        }
        if (as === 'select') {
            // FIX: Cast ref to the specific element type to resolve TypeScript error.
            return <select className={cn(baseClasses, className)} ref={ref as React.Ref<HTMLSelectElement>} {...props}>{children}</select>;
        }

        return (
            <input
                type={type}
                className={cn(baseClasses, className)}
                // FIX: Cast ref to the specific element type to resolve TypeScript error.
                ref={ref as React.Ref<HTMLInputElement>}
                {...props}
            />
        )
    }
)

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)} {...props} />
  )
);

// --- Tabs ---
const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({ activeTab: '', setActiveTab: () => {} });

// FIX: Add className prop to Tabs component.
// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
// FIX: Update Tabs to support controlled and uncontrolled state, resolving an error in AuthPage.
export const Tabs = ({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: React.PropsWithChildren<{
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}>) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue);
  const isControlled = value !== undefined;

  const activeTab = isControlled ? value : internalActiveTab;

  const setActiveTab = (newValue: string) => {
    if (!isControlled) {
      setInternalActiveTab(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab: activeTab ?? '', setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const TabsList = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
    {children}
  </div>
);

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const TabsTrigger = ({ value, children, className }: React.PropsWithChildren<{ value: string; className?: string }>) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "",
        className
      )}
    >
      {children}
    </button>
  );
};

// FIX: Add className prop to TabsContent component.
// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const TabsContent = ({ value, children, className }: React.PropsWithChildren<{ value: string; className?: string }>) => {
  const { activeTab } = useContext(TabsContext);
  return activeTab === value ? <div className={className}>{children}</div> : null;
};

// --- Sheet ---
// FIX: Update Sheet to work as a controlled component with `open` and `onOpenChange` props.
const SheetContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const Sheet = ({ children, open, onOpenChange }: React.PropsWithChildren<{ open?: boolean, onOpenChange?: (open: boolean) => void }>) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? open : internalIsOpen;
  const setIsOpen = isControlled && onOpenChange ? onOpenChange : setInternalIsOpen;

  return (
    <SheetContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const SheetTrigger = ({ children }: React.PropsWithChildren<{}>) => {
  const { setIsOpen } = useContext(SheetContext);
  return <div onClick={() => setIsOpen(true)}>{children}</div>;
};

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const SheetContent = ({ children, side='right', className }: React.PropsWithChildren<{ side?: 'top' | 'bottom' | 'left' | 'right', className?: string }>) => {
  const { isOpen, setIsOpen } = useContext(SheetContext);

  const sideClasses = {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-300", 
        sideClasses[side], 
        isOpen ? "translate-x-0" : side === 'right' ? "translate-x-full" : "-translate-x-full",
        className
        )}
      >
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>
    </>
  );
};

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
export const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
);
export const SheetDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

// --- Popover ---
const PopoverContext = createContext({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {},
});

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const Popover = ({ children }: React.PropsWithChildren<{}>) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={popoverRef} className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const PopoverTrigger = ({ children }: React.PropsWithChildren<{}>) => {
  const { isOpen, setIsOpen } = useContext(PopoverContext);
  return <div onClick={() => setIsOpen(!isOpen)}>{children}</div>;
};

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const PopoverContent = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => {
  const { isOpen } = useContext(PopoverContext);
  if (!isOpen) return null;
  return (
    <div className={cn("absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none mt-2", className)}>
      {children}
    </div>
  );
};

// --- ToggleGroup ---
const ToggleGroupContext = React.createContext<{
  value: string | null;
  onValueChange: (value: string) => void;
}>({ value: null, onValueChange: () => {} });

// FIX: Use React.PropsWithChildren to correctly type props with implicit children.
export const ToggleGroup = ({
  value,
  onValueChange,
  children
}: React.PropsWithChildren<{
  value: string | null;
  onValueChange: (value: string) => void;
}>) => {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div className="flex items-center justify-center gap-1">{children}</div>
    </ToggleGroupContext.Provider>
  );
};

// FIX: Use React.PropsWithChildren to correctly type props with implicit children and handle key prop correctly.
export const ToggleGroupItem = ({ value, children, className }: React.PropsWithChildren<{ value: string; className?: string }>) => {
  const { value: selectedValue, onValueChange } = React.useContext(ToggleGroupContext);
  const isSelected = selectedValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-3",
        isSelected ? "bg-primary text-primary-foreground" : "bg-transparent",
        className
      )}
    >
      {children}
    </button>
  );
};

// --- Calendar ---
export const Calendar = ({ date, setDate, className }: { date: Date | undefined, setDate: (date: Date) => void, className?: string }) => {
    const [currentMonth, setCurrentMonth] = useState(date ? date : new Date());

    const changeMonth = (amount: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const daysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };
    
    const firstDayOfMonth = () => {
        return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    }

    const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    const monthDays = daysInMonth();
    const emptyDays = Array(firstDayOfMonth()).fill(null);

    return (
        <div className={cn("p-3 space-y-4", className)}>
            <div className="flex justify-between items-center">
                <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm font-medium">
                    {currentMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                </span>
                <Button variant="outline" size="icon" onClick={() => changeMonth(1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {weekDays.map(day => <div key={day} className="text-muted-foreground">{day}</div>)}
                {emptyDays.map((_, i) => <div key={`empty-${i}`} />)}
                {monthDays.map(day => (
                    <Button
                        key={day.toString()}
                        onClick={() => setDate(day)}
                        variant={date?.toDateString() === day.toDateString() ? 'default' : 'ghost'}
                        size="icon"
                        className="h-8 w-8 p-0 font-normal"
                    >
                        {day.getDate()}
                    </Button>
                ))}
            </div>
        </div>
    );
};