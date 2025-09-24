import React, { useState } from "react";

type DataItem = {
  id: string;
  fullName: string;
  email: string;
  emailLinkedName: string;
  contactNumber: string;
  institutionName: string;
  category: string;
  enrollmentID: string;
  [key: string]: any;
};

type Props = {
  data?: DataItem[] | null;
  loading: any;
};

const DataDisplayComponent: React.FC<Props> = ({ data, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!data || data.length === 0) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white-500 text-center">
          {!loading && "Permission Denied !!!"}
        </h1>
      </div>
    );
  }

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const renderTable = () => (
    <table className="table-auto w-full border border-gray-300 bg-white shadow-lg rounded-lg">
      <thead className="bg-gray-200">
        <tr>
          {["Full Name", "Email", "Contact Number", "Institution Name",
            "Category", "Enrollment ID", "Result (Out of 100)", "Status"].map((header) => (
              <th key={header} className="border border-gray-300 px-4 py-2 text-left text-black">
                {header}
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => {
            const marks = Object.keys(item)
              .filter((key) => key.startsWith("QZ-"))
              .reduce((total, key) => total + item[key].results.correctAnswers, 0);

            const status = marks < 40 ? "Failed" : "Pass";
            const statusColor = marks < 40 ? "text-red-500" : "text-green-500";

            return (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-300`}
              >
                {[
                  item.fullName,
                  item.email,
                  item.contactNumber,
                  item.institutionName,
                  item.category,
                  item.enrollmentID,
                  marks
                ].map((value, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2 text-black">
                    {value}
                  </td>
                ))}
                <td className={`border border-gray-300 px-4 py-2 font-bold ${statusColor}`}>
                  {status}
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td className="text-center text-gray-500 py-4 text-black">
              No results found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">
        User Data Table
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="text-black w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        {renderTable()}
      </div>
    </div>
  );
};

export default DataDisplayComponent;