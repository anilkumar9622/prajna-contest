'use client';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store';
import Dropdown from '@/components/dropdown';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconFile from '../icon/icon-file';
import IconPrinter from '../icon/icon-printer';
import { FormValues } from '@/utils/schemaValidation';
import SkeletonTable from '../skeleton/skeletonTable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Select from 'react-select';
import IconEdit from '../icon/icon-edit';
import { showToast } from '@/utils/toast';

const PrajnaContest = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [rowData, setUsers] = useState<FormValues[]>([]);
    const [loading, setLoading] = useState(true);
    // console.log(rowData);

    // show/hide
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState<FormValues[]>([]);
    const [recordsData, setRecordsData] = useState<FormValues[]>([]);

    // whenever rowData updates, reset initialRecords & recordsData
    useEffect(() => {
        if (rowData.length > 0) {
            setInitialRecords(rowData);
            setRecordsData(rowData);
        }
    }, [rowData]);

    // console.log(initialRecords, recordsData, ">>>>");

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [hideCols, setHideCols] = useState<any>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user');
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                const data = await res.json();
                setUsers(data.users || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
    const formatDate = (date: any) => {
        if (date) {
            const dt = new Date(date);
            const month = dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
            const day = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
            return day + '/' + month + '/' + dt.getFullYear();
        }
        return '';
    };

    const showHideColumns = (col: any, value: any) => {
        if (hideCols.includes(col)) {
            setHideCols((col: any) => hideCols.filter((d: any) => d !== col));
        } else {
            setHideCols([...hideCols, col]);
        }
    };

    const cols = [
        { accessor: 'id', title: 'ID' },
        { accessor: 'createdAt', title: 'Created At' },
        { accessor: 'name', title: 'Full Name' },
        { accessor: 'gender', title: 'Gender' },
        { accessor: 'email', title: 'Email' },
        { accessor: 'phone', title: 'Phone' },
        { accessor: 'instituteType', title: 'Institute Type' },
        { accessor: 'institute', title: 'Institute Name' },
        { accessor: 'registrationPaymentMode', title: 'Payment Mode' },
        { accessor: 'paymentStatus', title: 'Payment Status' },
        { accessor: 'paymentId', title: 'Payment Id' },
        { accessor: 'paymentAmount', title: 'Payment Amount' },
        { accessor: 'isCourier', title: 'Is Courier' },
        { accessor: 'courier', title: 'Courier Address' },
        { accessor: 'regBace', title: 'Registering Bace' },
        { accessor: 'volunteer', title: 'Volunteer' },
        { accessor: 'dob', title: 'Birthdate' },
        { accessor: 'remarks', title: 'Remarks' },

    ];

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return (
                    [
                        item?.id,
                        // item?.createdAt?._seconds
                        //   ? new Date(item.createdAt._seconds * 1000).toLocaleString('en-GB')
                        //   : item?.createdAt,
                        item?.name,
                        item?.gender,
                        item?.email,
                        item?.instituteType,
                        item?.dob,
                        item?.institute,
                        item?.regBace,
                        item?.phone,
                        item?.registrationPaymentMode,
                        item?.totalRegistrationAmount,
                        item?.payment?.status,
                        item?.payment?.amount,
                        item?.payment?.paymentId,
                        item?.volunteer?.name,
                        item?.volunteer?.contact,
                    ]
                        .filter(Boolean) // remove null/undefined
                        .some((val) =>
                            String(val)?.toLowerCase()?.includes(search?.toLowerCase()?.trim())
                        )
                );

            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const col = ['id', 'createdAt', 'name', 'gender', 'email', 'phone', 'dob', 'instituteType', 'institute', 'registrationPaymentMode', 'paymentStatus', 'paymentId', 'paymentAmount', 'isCourier', 'courier', 'regBace', 'volunteer', 'remarks'];


    const exportTable = (type: string) => {
        const filename = 'Prajna_Registration_Data'
        const columns: string[] = col;
        const records: any[] = rowData;
        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

        const getNestedValue = (obj: any, path: string) =>
            path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? '';

        const formatDate = (seconds: number) => {
            const date = new Date(seconds * 1000);
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Kolkata',
            };
            return date.toLocaleString('en-GB', options).replace(',', ', at');
        };

        // ✅ Centralized data extraction for all export types
        const getValue = (item: any, col: string) => {
            switch (col) {
                case 'paymentStatus':
                    return getNestedValue(item, 'payment.status');
                case 'paymentAmount':
                    return getNestedValue(item, 'payment.amount') || item.totalRegistrationAmount || '';
                case 'paymentId':
                    return getNestedValue(item, 'payment.paymentId');
                case 'courier': {
                    const c = item.courier || {};
                    return c.houseNo
                        ? `${c.houseNo}, ${c.line1 || ''}, ${c.city || ''}, ${c.state || ''} - ${c.pincode || ''}`.replace(/\s+,/g, ',').trim()
                        : 'N/A';
                }
                case 'volunteer': {
                    const v = item.volunteer || {};
                    return v.name ? `${v.name}, ${v.contact || ''}`.trim() : 'N/A';
                }
                case 'createdAt': {
                    const ts = getNestedValue(item, 'createdAt._seconds');
                    return ts ? formatDate(ts) : '';
                }
                default:
                    const val = item[col];
                    if (typeof val === 'object' && val !== null) return JSON.stringify(val);
                    return val ?? '';
            }
        };

        // ✅ Build table data (header + rows)
        const data = [
            columns.map((d) => capitalize(d)),
            ...records.map((item) => columns.map((col) => getValue(item, col))),
        ];

        // ===============================
        // ---- CSV Export ----
        // ===============================
        if (type === 'csv') {
            const result = data
                .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))
                .join('\n');
            const blob = new Blob(['\uFEFF' + result], { type: 'text/csv;charset=utf-8;' });
            saveAs(blob, `${filename}.csv`);
        }

        // ===============================
        // ---- XLSX Export ----
        // ===============================
        else if (type === 'xlsx') {
            const ws = XLSX.utils.aoa_to_sheet(data);
            const colWidths = columns.map((colKey) => {
                const maxCellLength = records.reduce((max, record) => {
                    const val = String(getValue(record, colKey) || '');
                    return Math.max(max, val.length);
                }, colKey.length);
                return { wch: Math.min(Math.max(maxCellLength + 2, 10), 50) };
            });
            ws['!cols'] = colWidths;
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            saveAs(blob, `${filename}.xlsx`);
        }

        // ===============================
        // ---- TXT Export ----
        // ===============================
        else if (type === 'txt') {
            const result = data.map((row) => row.join('\t')).join('\n');
            const blob = new Blob([result], { type: 'text/plain;charset=utf-8;' });
            saveAs(blob, `${filename}.txt`);
        }

        // ===============================
        // ---- PRINT ----
        // ===============================
        else if (type === 'print') {
            let html = `
      <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 16px; color: #333; }
          h2 { text-align: center; margin-bottom: 16px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 6px; text-align: left; vertical-align: top; }
          th { background: #eff5ff; color: #333; }
          tr:nth-child(even) { background: #fafafa; }
        </style>
      </head>
      <body>
        <h2>${filename.replace(/_/g, ' ')}</h2>
        <table>
          <thead>
            <tr>${columns.map((c) => `<th>${capitalize(c)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${records
                    .map(
                        (item) =>
                            `<tr>${columns
                                .map((col) => `<td>${getValue(item, col) || ''}</td>`)
                                .join('')}</tr>`
                    )
                    .join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

            const winPrint = window.open('', '', 'width=1000,height=600');
            winPrint!.document.write(html);
            winPrint!.document.close();
            winPrint!.focus();
            winPrint!.print();
        }
    };




    const capitalize = (text: any) => {
        return text
            .replace('_', ' ')
            .replace('-', ' ')
            .toLowerCase()
            .split(' ')
            .map((s: any) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

   const updatePaymentStatus = async (id: string, status: string) => {
  try {
    const res = await fetch(`/api/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: status }),
    });

    const data = await res.json();
    if (!res.ok) {
      showToast("error", "Update failed");
      throw new Error(data.error || "Update failed");
    }

    showToast("success", "Status Updated");
    setEditVal("");

    // ✅ Update the local state instead of full refetch
    setUsers((prevUsers: any[]) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              payment: {
                ...user.payment,
                status: status,
                updatedAt: new Date().toISOString(),
              },
            }
          : user
      )
    );
  } catch (err) {
    console.error("Error updating payment:", err);
    showToast("error", "Something went wrong");
  }
};


    const [editVal, setEditVal] = useState<any>(false)
    const editHandler = (id: any) => {
        setEditVal(id)
    }


    return (
        <div className="panel">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Prajñā Registraion Data</h5>
                <div className="flex items-center gap-5 ltr:ml-auto rtl:mr-auto">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="dropdown">
                            <Dropdown
                                placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                btnClassName="!flex items-center border font-semibold border-white-light dark:border-[#253b5c] rounded-md px-4 py-2 text-sm dark:bg-[#1b2e4b] dark:text-white-dark"
                                button={
                                    <>
                                        <span className="ltr:mr-1 rtl:ml-1">Columns</span>
                                        <IconCaretDown className="h-5 w-5" />
                                    </>
                                }
                            >
                                <ul className="!min-w-[140px]">
                                    {cols.map((col, i) => {
                                        return (
                                            <li
                                                key={i}
                                                className="flex flex-col"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <div className="flex items-center px-4 py-1">
                                                    <label className="mb-0 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={!hideCols.includes(col.accessor)}
                                                            className="form-checkbox"
                                                            defaultValue={col.accessor}
                                                            onChange={(event: any) => {
                                                                setHideCols(event.target.value);
                                                                showHideColumns(col.accessor, event.target.checked);
                                                            }}
                                                        />
                                                        <span className="ltr:ml-2 rtl:mr-2">{col.title}</span>
                                                    </label>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="text-right">
                        <input type="text" className="form-input" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="flex flex-wrap items-center">
                        <button type="button" onClick={() => exportTable('xlsx')} className="btn btn-primary btn-sm m-1">
                            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                            EXCEL
                        </button>
                        <button type="button" onClick={() => exportTable('csv')} className="btn btn-primary btn-sm m-1 ">
                            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                            CSV
                        </button>
                        <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            PRINT
                        </button>
                    </div>
                </div>
            </div>
            <div className="datatables">
                {loading ? (
                    <SkeletonTable rows={10} cols={10} />
                ) :
                    (<DataTable
                        className="table-hover whitespace-nowrap"
                        records={recordsData.filter((record: any) => record.role !== "admin")}
                        columns={[
                            {
                                accessor: 'id',
                                title: 'ID',
                                sortable: true,
                                hidden: hideCols.includes('id'),
                            },
                            {
                                accessor: 'createdAt',
                                title: 'Created At',
                                sortable: true,
                                hidden: hideCols.includes('createdAt'),
                                render: (row: any) => {
                                    const ts = row.createdAt;
                                    if (!ts?._seconds) return '-';
                                    const date = new Date(ts._seconds * 1000);
                                    const options: Intl.DateTimeFormatOptions = {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'Asia/Kolkata',
                                    };
                                    const formatted = date.toLocaleString('en-GB', options);
                                    return formatted.replace(',', ', at');
                                }

                            },
                            {
                                accessor: 'name',
                                title: 'Full Name',
                                sortable: true,
                                hidden: hideCols.includes('name'),

                            },
                            {
                                accessor: 'gender',
                                title: 'Gender',
                                sortable: true,
                                hidden: hideCols.includes('gender'),
                            },
                            {
                                accessor: 'email',
                                title: 'Email',
                                sortable: true,
                                hidden: hideCols.includes('email'),
                            },
                            {
                                accessor: 'dob',
                                title: 'D.O.B',
                                sortable: true,
                                hidden: hideCols.includes('dob'),
                                render: ({ dob }) => <div>{formatDate(dob)}</div>,
                            },
                            {
                                accessor: 'phone',
                                title: 'Phone',
                                sortable: true,
                                hidden: hideCols.includes('phone'),
                            },
                            {
                                accessor: "instituteType",
                                title: "Institute Type",
                                sortable: true,
                                hidden: hideCols.includes("instituteType"),
                                render: (record) => {
                                    const type = record.instituteType;

                                    // map type → color
                                    const typeColors: Record<string, string> = {
                                        school: "badge-outline-danger",
                                        college: "badge-outline-secondary",
                                    };

                                    const badgeColor = typeColors[type] || "badge-outline-dark"; // fallback

                                    return (
                                        <span className={`badge ${badgeColor}`}>
                                            {type}
                                        </span>
                                    );
                                },
                            },

                            {
                                accessor: 'institute',
                                title: 'Institute Name',
                                sortable: true,
                                hidden: hideCols.includes('institute'),
                            },
                            {
                                accessor: 'registrationPaymentMode',
                                title: 'Payment Mode',
                                sortable: true,
                                hidden: hideCols.includes('registrationPaymentMode'),
                                render: (record) => {
                                    const type = record.registrationPaymentMode;

                                    // map type → color
                                    const typeColors: Record<string, string> = {
                                        online: "badge-outline-primary",
                                        offline: "badge-outline-secondary",
                                    };

                                    // const badgeColor = typeColors[type] || "badge-outline-dark"; // fallback
                                    const statusColors: Record<string, string> = {
                                        online: 'bg-primary',
                                        offline: 'bg-secondary',
                                    };
                                    const bgColor = statusColors[type] || 'bg-secondary';

                                    return (
                                        <span className={`badge ${bgColor}`}>
                                            {(type ?? "")?.toUpperCase()}
                                        </span>
                                    );
                                },
                            },
                            {
                                accessor: 'paymentStatus',
                                title: 'Payment Status',
                                sortable: true,
                                render: ({ id, payment, registrationPaymentMode }) => {
                                    // console.log({ payment })
                                    // Map status to color
                                    const statusColors: Record<string, string> = {
                                        success: 'bg-success',
                                        pending: 'bg-warning',
                                        failed: 'bg-danger',
                                        to_be_paid: 'bg-secondary',
                                        paid: 'bg-success',
                                    };

                                    const bgColor = statusColors[payment?.status] || 'bg-secondary';
                                    const options = [
                                        { value: 'success', label: 'Success' },
                                        { value: 'pending', label: 'Pending' },
                                        { value: 'to_be_paid', label: 'To be Paid' },
                                        { value: 'paid', label: 'Paid' },
                                    ];

                                    const selectedOption = options.find(
                                        (opt) => opt.value === payment?.status?.toLowerCase()
                                    );


                                    return (
                                        registrationPaymentMode === "offline" ? (
                                            <>
                                                {editVal == id ? <Select
                                                    defaultValue={selectedOption}
                                                    options={options}
                                                    isSearchable={false}
                                                    onChange={(option: any) => updatePaymentStatus(id, option.value)}
                                                /> :
                                                    <div className='flex items-center gap-2'>
                                                        <span className={`badge ${bgColor}`}>
                                                            {(payment?.status ?? "").toUpperCase()}
                                                        </span>
                                                        <button onClick={() => editHandler(id)} className='cursor-pointer' >
                                                            <IconEdit />
                                                        </button>
                                                    </div>}
                                            </>
                                        ) : (
                                            <span className={`badge ${bgColor}`}>
                                                {(payment?.status ?? "").toUpperCase()}
                                            </span>

                                        )
                                    );


                                },
                            },
                            {
                                accessor: 'paymentId',
                                title: 'Payment Id',
                                sortable: true,
                                hidden: hideCols.includes('paymentAmount'),
                                render: ({ payment }) => <div>{(payment?.paymentId ?? "")}</div>,

                            },
                            {
                                accessor: 'paymentAmount',
                                title: 'Payment Amount',
                                sortable: true,
                                hidden: hideCols.includes('paymentAmount'),
                                render: ({ payment, totalRegistrationAmount }) => <div>{(payment?.amount || totalRegistrationAmount)}</div>,

                            },
                            {
                                accessor: "isCourier",
                                title: "Courier",
                                sortable: true,
                                hidden: hideCols.includes("isCourier"),
                                render: (record) => {
                                    const type = record.isCourier; // boolean

                                    // map type → color
                                    const typeColors: Record<string, string> = {
                                        true: "bg-primary",
                                        false: "bg-danger",
                                    };

                                    const badgeColor = typeColors[String(type)] || "badge-outline-dark";

                                    return (
                                        <span className={`badge ${badgeColor}`}>
                                            {type ? "Yes" : "No"}
                                        </span>
                                    );
                                },
                            },

                            {
                                accessor: 'courier',
                                title: 'Courier Address',
                                sortable: true,
                                hidden: hideCols.includes('courier'),
                                render: ({ courier }) => <div>{courier?.houseNo ? `${courier.houseNo}, ${courier.line1}, ${courier.city}, ${courier.state} - ${courier.pincode}` : 'N/A'}</div>,
                            },
                            {
                                accessor: 'regBace',
                                title: 'Bace',
                                sortable: true,
                                hidden: hideCols.includes('regBace'),
                            },
                            {
                                accessor: 'volunteer',
                                title: 'Volunteer',
                                sortable: true,
                                hidden: hideCols.includes('volunteer'),
                                render: ({ volunteer }) => <div>{volunteer?.name ? `${volunteer.name}, ${volunteer.contact}` : 'N/A'}</div>,
                            },
                            {
                                accessor: 'remarks',
                                title: 'Remarks',
                                sortable: true,
                                hidden: hideCols.includes('remarks'),
                                // render: ({ dob }) => <div>{formatDate(dob)}</div>,
                            },
                            {
                                accessor: 'isActive',
                                title: 'Active',
                                sortable: true,
                                hidden: hideCols.includes('isActive'),
                                render: ({ isActive }: any) => <div className={`${isActive ? 'text-success' : 'text-danger'} capitalize`}>{isActive?.toString()}</div>,
                            },

                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />)}
            </div>
             <style jsx global>
                {`
                    /* target title inside toast */
                    .small-toast {
                        padding: 10px 20px !important;
                    }
                    .small-toast .swal2-title {
                        font-size: 16px; /* smaller text */
                        line-height: 1.2; /* optional, adjust spacing */
                    }

                    .small-toast .swal2-icon {
                        width: 12px; /* optional: smaller icon */
                        height: 12px;
                    }
                `}
            </style>
        </div>
    );
};

export default PrajnaContest;
