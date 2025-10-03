import React from "react";

const SkeletonTable = ({ rows = 5, cols = 8 }) => {
  return (
    <div className="animate-pulse">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th
                key={i}
                className="border border-gray-200 p-2 bg-gray-100 text-gray-500 text-sm"
              >
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="border border-gray-200 p-2">
                  <div className="h-4 w-full bg-gray-300 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
