import { useTable } from "react-table";

const DataTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} className="w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="border border-gray-300">
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()} className="p-2 border border-gray-300 text-left">
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="border border-gray-300 hover:bg-gray-100">
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} className="p-2 border border-gray-300">
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
