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


const AdminDashboard = () => {
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const [rowData, setUsers] = useState<FormValues[]>([]);
    const [loading, setLoading] = useState(true);
    console.log(rowData);

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

    console.log(initialRecords, recordsData, ">>>>");

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [hideCols, setHideCols] = useState<any>(['age', 'dob', 'isActive']);
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
        { accessor: 'name', title: 'Full Name' },
        { accessor: 'gender', title: 'Gender' },
        { accessor: 'email', title: 'Email' },
        { accessor: 'phone', title: 'Phone' },
        { accessor: 'instituteType', title: 'Institute Type' },
        { accessor: 'institute', title: 'Institute Name' },
        { accessor: 'paymentStatus', title: 'Remarks' },
        { accessor: 'regBace', title: 'Registering Bace' },
        { accessor: 'dob', title: 'Birthdate' },
        { accessor: 'isCourier', title: 'Courier' },
        { accessor: 'courier', title: 'Courier Address' },
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
                    item.id.toString().includes(search.toLowerCase()) ||
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.gender.toLowerCase().includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.instituteType.toLowerCase().includes(search.toLowerCase()) ||
                    item.dob.toLowerCase().includes(search.toLowerCase()) ||
                    item.institute.toLowerCase().includes(search.toLowerCase()) ||
                    item.regBace.toLowerCase().includes(search.toLowerCase()) ||
                    item.phone.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const col = ['id', 'name', 'gneder', 'email', 'phone', 'dob', 'instituteType', 'institute', 'regBace', "remarks", 'isCourier', 'courier'];

    const exportTable = (type: any) => {
        let columns: any = col;
        let records = rowData;
        let filename = 'table';

        let newVariable: any;
        newVariable = window.navigator;

        if (type === 'csv') {
            let coldelimiter = ';';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/csv/i) && !newVariable.msSaveOrOpenBlob) {
                var data = 'data:application/csv;charset=utf-8,' + encodeURIComponent(result);
                var link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename + '.csv');
                link.click();
            } else {
                var blob = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob, filename + '.csv');
                }
            }
        } else if (type === 'print') {
            var rowhtml = '<p>' + filename + '</p>';
            rowhtml +=
                '<table style="width: 100%; " cellpadding="0" cellcpacing="0"><thead><tr style="color: #515365; background: #eff5ff; -webkit-print-color-adjust: exact; print-color-adjust: exact; "> ';
            columns.map((d: any) => {
                rowhtml += '<th>' + capitalize(d) + '</th>';
            });
            rowhtml += '</tr></thead>';
            rowhtml += '<tbody>';
            records.map((item: any) => {
                rowhtml += '<tr>';
                columns.map((d: any) => {
                    let val = item[d] ? item[d] : '';
                    rowhtml += '<td>' + val + '</td>';
                });
                rowhtml += '</tr>';
            });
            rowhtml +=
                '<style>body {font-family:Arial; color:#495057;}p{text-align:center;font-size:18px;font-weight:bold;margin:15px;}table{ border-collapse: collapse; border-spacing: 0; }th,td{font-size:12px;text-align:left;padding: 4px;}th{padding:8px 4px;}tr:nth-child(2n-1){background:#f7f7f7; }</style>';
            rowhtml += '</tbody></table>';
            var winPrint: any = window.open('', '', 'left=0,top=0,width=1000,height=600,toolbar=0,scrollbars=0,status=0');
            winPrint.document.write('<title>Print</title>' + rowhtml);
            winPrint.document.close();
            winPrint.focus();
            winPrint.print();
        } else if (type === 'txt') {
            let coldelimiter = ',';
            let linedelimiter = '\n';
            let result = columns
                .map((d: any) => {
                    return capitalize(d);
                })
                .join(coldelimiter);
            result += linedelimiter;
            records.map((item: any) => {
                columns.map((d: any, index: any) => {
                    if (index > 0) {
                        result += coldelimiter;
                    }
                    let val = item[d] ? item[d] : '';
                    result += val;
                });
                result += linedelimiter;
            });

            if (result == null) return;
            if (!result.match(/^data:text\/txt/i) && !newVariable.msSaveOrOpenBlob) {
                var data1 = 'data:application/txt;charset=utf-8,' + encodeURIComponent(result);
                var link1 = document.createElement('a');
                link1.setAttribute('href', data1);
                link1.setAttribute('download', filename + '.txt');
                link1.click();
            } else {
                var blob1 = new Blob([result]);
                if (newVariable.msSaveOrOpenBlob) {
                    newVariable.msSaveBlob(blob1, filename + '.txt');
                }
            }
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

    // const randomColor = () => {
    //     const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    //     // const random = Math.floor(Math.random() * color.length);
    //     return color;
    // };

    // const randomStatus = () => {
    //     const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
    //     // const random = Math.floor(Math.random() * status.length);
    //     return status;
    // };


    if (loading) return <div>Loading...</div>;


    return (
        <div className="panel">
            <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-center">
                <h5 className="text-lg font-semibold dark:text-white-light">Prajna Registraion Data</h5>
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
                        <button type="button" onClick={() => exportTable('csv')} className="btn btn-primary btn-sm m-1 ">
                            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                            CSV
                        </button>
                        <button type="button" onClick={() => exportTable('txt')} className="btn btn-primary btn-sm m-1">
                            <IconFile className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
                            TXT
                        </button>

                        <button type="button" onClick={() => exportTable('print')} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            PRINT
                        </button>
                    </div>
                </div>
            </div>
            <div className="datatables">
                <DataTable
                    className="table-hover whitespace-nowrap"
                    records={recordsData}
                    columns={[
                        {
                            accessor: 'id',
                            title: 'ID',
                            sortable: true,
                            hidden: hideCols.includes('id'),
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
                            accessor: 'paymentStatus',
                            title: 'Payment Status',
                            sortable: true,
                            render: ({ payment }) => {
                                console.log({payment})
                                // Map status to color
                                const statusColors: Record<string, string> = {
                                    success: 'bg-success',
                                    pending: 'bg-warning',
                                    failed: 'bg-danger',
                                };

                                const bgColor = statusColors[payment?.status] || 'bg-secondary';

                                return (
                                    <span className={`badge ${bgColor}`}>
                                        {(payment?.status ?? "")?.toUpperCase()}
                                    </span>
                                );
                            },
                        },
                        {
                            accessor: 'paymentAmount',
                            title: 'Payment Amount',
                            sortable: true,
                            hidden: hideCols.includes('paymentAmount'),
                            render: ({ payment }) => <div>{payment?.amount}</div>,

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
                            accessor: 'representative',
                            title: 'Representative',
                            sortable: true,
                            hidden: hideCols.includes('representative'),
                            render: ({ representative }) => <div>{representative?.name ? `${representative.name}, ${representative.contact}` : 'N/A'}</div>,
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
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
