// components/ui/alert/Alert.tsx
import React from "react";

interface AlertProps {
    title: string;
    description: string;
    type?: "success" | "error" | "warning" | "info";
}

export const Alert: React.FC<AlertProps> = ({title, description, type = "info"}) => {
    const colors = {
        success: "bg-green-100 text-green-700 border-green-300",
        error: "bg-red-100 text-red-700 border-red-300",
        warning: "bg-yellow-100 text-yellow-700 border-yellow-300",
        info: "bg-blue-100 text-blue-700 border-blue-300",
    };

    return (
        <div className={`p-4 border-l-4 rounded ${colors[type]}`}>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </div>
    );
};

export const AlertTitle: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <h4 className="font-bold">{children}</h4>
);

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <p>{children}</p>
);
