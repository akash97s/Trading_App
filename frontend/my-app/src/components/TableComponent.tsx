import React from 'react';
import Table from 'react-bootstrap/Table';

// Define the type for the data prop
interface Data {
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
}

interface Column {
  Header: string;
  accessor: keyof Data; // Ensure accessor is a key of Data
}

interface TableComponentProps {
  columns: Column[]; // Define columns prop
  data: Data[] | null;
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  // console.log("inside table component ", columns, data);

  if (data && data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className='table-container'>
    {/* <p>Table component</p> */}
    <Table style={{ color: 'white', fontSize: '20px', border: '5px solid #61dafb', width: '100%' }}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.accessor} style={{ color: 'Gray', margin: '10px', padding: '20px', border: '3px solid #61dafb' }}> {column.Header} </th> // Render header cells
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map(column => ( 
                <td key={column.accessor} style={{ padding:'20px' }}> {row[column.accessor]} </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
};

export default TableComponent;
