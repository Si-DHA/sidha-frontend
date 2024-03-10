import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon from FontAwesome library
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon from FontAwesome
import { useRouter } from "next/router";

interface DataTableProps {
  data: any[];
  columns: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, btnText, onClick }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter }, // Destructuring globalFilter from state
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Initial page index and size
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const renderTableHeader = () => {
    return headerGroups.map((headerGroup) => (
      <tr {...headerGroup.getHeaderGroupProps()} style={{ backgroundColor: '#f2f2f2' }}>
        <th style={{ textAlign: 'center' }}>No</th> {/* Add table header for numbering */}
        {headerGroup.headers.map((column) => (
          <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ textAlign: 'center' }}>
            {column.render('Header')}
            {column.isSorted ? ( // Check if the column is sorted
              column.isSortedDesc ? ( // Check if the column is sorted in descending order
                <span>&darr;</span> // Display down arrow
              ) : (
                <span>&uarr;</span> // Display up arrow
              )
            ) : (
              <span>&nbsp;</span> // Display empty space if not sorted
            )}
          </th>
        ))}
      </tr>
    ));
  };

  const renderTableBody = () => {
    const router = useRouter();
    const handleRowClick = (idTruk) => {
      router.push(`truk/detail?id=${idTruk}`);
    };

    return page.map((row, index) => {
      prepareRow(row);
      return (
        <tr
          className="hover"
          {...row.getRowProps()}
          style={{ borderBottom: '1px solid black' }}
          onClick={() => handleRowClick(row.original.idTruk)}
          key={index}>
          <td style={{ textAlign: 'center' }}>{index + 1}</td> {/* Add table cell for numbering */}
          {row.cells.map((cell) => {
            if (cell.column.id === 'expiredKir') { // Replace 'datetimeColumn' with the actual ID of your datetime column
              const date = new Date(cell.value); // Convert datetime string to Date object
              const formattedDate = date.toLocaleDateString(); // Format date to string (e.g., 'MM/DD/YYYY')
              return <td style={{ textAlign: 'center' }} {...cell.getCellProps()}>{formattedDate}</td>; // Render formatted date
            } else {
              return <td style={{ textAlign: 'center' }}{...cell.getCellProps()}>{cell.render('Cell')}</td>; // Render other cells as usual
            }
          })}
        </tr>
      );
    });
  };

  return (
    <div style={{ marginBottom: '20px', fontSize: '13px' }} className="overflow-x-auto">
      {/* Search input */}
      <div style={{ float: 'left', marginBottom: '10px' }}>
        <div style={{ position: 'relative' }}>
          <input
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          />
          <span style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            color: '#999'
          }}>
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>
      <div style={{ float: 'right', marginBottom: '15px' }}>
        <button className="btn btn-primary" onClick={onClick}>{btnText}</button>
      </div>
      <table className="table table-xs" {...getTableProps()} style={{ borderCollapse: 'separate', width: '100%', borderSpacing: '10 10px', marginBottom: '20px' }}>
        <thead>{renderTableHeader()}</thead>
        <tbody {...getTableBodyProps()}>{renderTableBody()}</tbody>
      </table>
      {/* Pagination */}
      <div style={{ float: 'left' }}>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{
              width: '60px',
              padding: '0.5rem 0.5rem',
              border: '1px solid #ccc',
              borderRadius: '5px',
              height: '30px'
            }}
          />
        </span>{' '}
      </div>
      <div style={{ float: 'right' }}>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
};

export default DataTable;
