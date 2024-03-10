import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';

interface DataTableProps {
  data: any[];
  columns: any[];
}

const DataTable: React.FC<DataTableProps> = ({ data, columns }) => {
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
    state: { pageIndex, pageSize },
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
        <th style={{textAlign:'center'}}>No</th> {/* Add table header for numbering */}
        {headerGroup.headers.map((column) => (
          <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}</th>
        ))}
      </tr>
    ));
  };
  
  const renderTableBody = () => {
    return page.map((row, index) => {
      prepareRow(row);
      return (
        <tr className="hover" {...row.getRowProps()} style={{ borderBottom: '1px solid black' }} key={index}>
          <td style={{textAlign:'center'}}>{index + 1}</td> {/* Add table cell for numbering */}
          {row.cells.map((cell) => {
            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
          })}
        </tr>
      );
    });
  };

  return (
    <div style={{ marginBottom: '20px' }} className="overflow-x-auto">
      <table className="table table-xs" {...getTableProps()} style={{ borderCollapse: 'separate', width: '100%', borderSpacing: '100 100px' }}>
        <thead>{renderTableHeader()}</thead>
        <tbody {...getTableBodyProps()}>{renderTableBody()}</tbody>
      </table>
      {/* Pagination */}
      <div>
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
            style={{ width: '100px' }}
          />
        </span>{' '}
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
