
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface BlurredCardProps extends Omit<HTMLMotionProps<"div">, "whileHover"> {
  children: React.ReactNode;
  className?: string;
  animateOnHover?: boolean;
}

const BlurredCard: React.FC<BlurredCardProps> = ({
  children,
  className,
  animateOnHover = true,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "glass-card overflow-hidden p-6",
        animateOnHover && "hover:-translate-y-1",
        className
      )}
      whileHover={
        animateOnHover
          ? {
              y: -5,
              transition: { duration: 0.2, ease: "easeInOut" },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default BlurredCard;
