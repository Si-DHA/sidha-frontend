import React, { useMemo } from 'react';
import { useTable, useSortBy, usePagination, useFilters, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon from FontAwesome library
import { faSearch } from '@fortawesome/free-solid-svg-icons'; // Import the search icon from FontAwesome
import { useRouter } from "next/router";

interface DataTableProps {
  data: any[];
  columns: any[];
  btnText?: string;
  onClick?: () => void;
  type?: string;
  biayaPengiriman?: any;
  loading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data = [],
  columns = [],
  btnText,
  onClick,
  type,
  biayaPengiriman,
  loading = false
}) => {
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
    if (loading) {
      return (
        <tr className='text-center'>
          <td colSpan={columns.length + 1} className="text-sm font-semibold pt-3">
            <span className="loading loading-spinner loading-lg"></span>
          </td>
        </tr>
      );
    }
    
    return headerGroups.map((headerGroup, index) => (
      <tr {...headerGroup.getHeaderGroupProps()} style={{ backgroundColor: '#f2f2f2' }} key={index} >
        <th style={{ textAlign: 'center' }}>No</th> {/* Add table header for numbering */}
        {headerGroup.headers.map((column) => (
          <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ textAlign: 'center' }} key={index} >
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
  
  const RenderTableBody = () => {
    const router = useRouter();
    if (loading) {
      return null;
    }
    
    if (!data || data.length === 0) {
      return (
        <tr className='text-center'>
          <td
            colSpan={columns.length + 1}
            className="text-base font-semibold pt-5"
          >
            {type && type != '' ? `Belum terdapat data ${type}` : 'Data tidak ditemukan'}
          </td>
        </tr>
      );
    }


    const handleRowClickTruk = (idTruk: any) => {
      router.push(`/truk/detail?id=${idTruk}`);
    };

    const handleRowClickUser = (idUser: any) => {
      router.push(`/list-user/detail?id=${idUser}`);
    }

    const handleRowClickKontrak = (idUser: any) => {
      router.push(`/kontrak?id=${idUser}`);
    }

    const handleRowClickOrder = (idOrder: any) => {
      router.push(`/order/${idOrder}`);
    }

    return page.map((row: any, index) => {
      prepareRow(row);
      return (
        <tr
          className="hover"
          {...row.getRowProps()}
          style={{ borderBottom: '1px solid black' }}
          onClick={() => {
            if (type === 'user') {
              handleRowClickUser(row.original.id);
            } else if (type === "kontrak") {
              handleRowClickKontrak(row.original.userId);
            } else if (type === 'order') {
              handleRowClickOrder(row.original.idOrder);
            }
          }}
          key={index}>
          <td style={{ textAlign: 'center' }}>{index + 1}</td> {/* Add table cell for numbering */}
          {row.cells.map((cell: any, index: any) => {
            return <td style={{ textAlign: 'center' }}{...cell.getCellProps()} key={index} >{cell.render('Cell')}</td>; // Render other cells as usual
          })}
        </tr>
      );
    });
  };

  const RenderTableFooterPurchaseOrder = (biayaPengiriman: any) => {
    if (loading) {
      return;
    }

    return (
      <tfoot>
        <tr>
          <td colSpan={5} style={{ textAlign: 'right' }}>Total Biaya Pengiriman</td>
          <td style={{ textAlign: 'center' }}>
            {biayaPengiriman}
          </td>
        </tr>
      </tfoot>);
  }

  return (
    <div style={{ marginBottom: '20px', fontSize: '13px' }} className="overflow-x-auto">
      {/* Search input */}
      {type != "checkout" &&
        data && data.length > 0 &&
        <div style={{ float: 'left', marginBottom: '10px' }}>
          <div style={{ position: 'relative' }}>
            <input
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Cari..."
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
        </div>}
      {!loading && btnText && onClick &&
        <div style={{ float: 'right', marginBottom: '15px' }}>
          <button className="btn btn-primary" onClick={onClick}>{btnText}</button>
        </div>

      }

      <table className="table table-xs" {...getTableProps()} style={{ borderCollapse: 'separate', width: '100%', borderSpacing: '10 10px', marginBottom: '20px' }}>
        <thead>{renderTableHeader()}</thead>
        <tbody {...getTableBodyProps()}>{RenderTableBody()}</tbody>
        {type === 'checkout' && RenderTableFooterPurchaseOrder(biayaPengiriman)}
      </table>

      {data && data.length > 0 &&
        <div>
          {/* Pagination */}
          <div style={{ float: 'left' }}>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage} style={{ paddingLeft: '5px' }}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage} style={{ paddingLeft: '5px' }}>
              {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} style={{ paddingLeft: '5px' }}>
              {'>>'}
            </button>{' '}
            <span style={{ paddingLeft: '5px' }}>
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
                  width: '50px',
                  padding: '0.5rem 0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  height: '25px'
                }}
              />
            </span>{' '}
          </div>
          <div style={{ float: 'right' }}>
            <select className='rounded-lg'
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
      }
    </div>
  );
};

export default DataTable;
