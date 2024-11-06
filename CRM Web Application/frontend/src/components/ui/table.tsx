// components/ui/table/Table.tsx
import React from "react";

export const Table: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <table className="table-auto w-full border border-gray-300">{children}</table>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <thead>{children}</thead>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <thead className="bg-gray-200">{children}</thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <tbody>{children}</tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <tr>{children}</tr>
);

export const TableCell: React.FC<{ children: React.ReactNode; isHeader?: boolean }> = ({children, isHeader}) => (
    <td className={`border border-gray-300 px-4 py-2 ${isHeader ? "font-semibold" : ""}`}>{children}</td>
);
