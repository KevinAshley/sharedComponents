import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { TableCellProps } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddCircle from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import { visuallyHidden } from "@mui/utils";
import moment from "moment";
import { Dispatch, Fragment, SetStateAction } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

export enum ColumnType {
    TEXT = "text",
    NUMBER = "number",
    DATE = "date",
    BOOLEAN = "boolean",
}

export type DataRow = {
    id: number;
    [key: string]: string | number | Date | boolean | null;
};

function descendingComparator<DataRow>(
    a: DataRow,
    b: DataRow,
    orderBy: keyof DataRow
) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    if (b[orderBy] === null || a[orderBy] === null) {
        if (b[orderBy] === null && a[orderBy]) {
            return -1;
        }
        if (b[orderBy] && a[orderBy] === null) {
            return 1;
        }
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof DataRow>(
    order: Order,
    orderBy: Key
): (a: DataRow, b: DataRow) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<DataRow>(
    array: readonly DataRow[],
    comparator: (a: DataRow, b: DataRow) => number
) {
    const stabilizedThis = array.map(
        (el, index) => [el, index] as [DataRow, number]
    );
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    id: keyof DataRow;
    label: string;
    type: ColumnType;
}

export interface TableColumnIf {
    label: string;
    id: string;
    type: ColumnType;
}

interface EnhancedTableHeadProps {
    numSelected: number;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof DataRow
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string | number;
    rowCount: number;
    tableColumns: TableColumnIf[];
    withActions: boolean;
    loading: boolean;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        tableColumns,
        withActions,
        loading,
    } = props;
    const createSortHandler =
        (property: keyof DataRow) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    const headCells: readonly HeadCell[] = tableColumns.map((thisColumn) => {
        return {
            id: thisColumn.id,
            type: thisColumn.type,
            disablePadding: true,
            label: thisColumn.label,
        };
    });

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": "select all desserts",
                        }}
                        disabled={loading}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={
                            [ColumnType.DATE, ColumnType.NUMBER].includes(
                                headCell.type
                            )
                                ? "right"
                                : "left"
                        }
                        sortDirection={orderBy === headCell.id ? order : false}
                        padding={
                            headCell.type == ColumnType.BOOLEAN
                                ? "checkbox"
                                : undefined
                        }
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                            disabled={loading}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {withActions && <TableCell align={"right"}>Actions</TableCell>}
            </TableRow>
        </TableHead>
    );
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    setAddNewOpen: Function;
    title: string;
    deleteSelected: Function;
    loading: boolean;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, setAddNewOpen, title, deleteSelected, loading } =
        props;
    const handleDeleteClick = () => {
        deleteSelected();
    };
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity
                        ),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {title}
                </Typography>
            )}
            {loading ? (
                <IconButton disabled={true}>
                    <CircularProgress size={20} disableShrink={true} />
                </IconButton>
            ) : (
                <Fragment>
                    {numSelected > 0 ? (
                        <Tooltip title="Delete">
                            <IconButton
                                onClick={handleDeleteClick}
                                disabled={loading}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Add New">
                            <IconButton
                                onClick={() => setAddNewOpen(true)}
                                disabled={loading}
                            >
                                <AddCircle />
                            </IconButton>
                        </Tooltip>
                    )}
                </Fragment>
            )}
        </Toolbar>
    );
}

const makeTableCellDisplayValue = ({
    type,
    value,
}: {
    type: ColumnType;
    value: any;
}) => {
    if (type === ColumnType.DATE) {
        return value ? moment(value).format("MMMM Do YYYY, h:mm:ss a") : "";
    }
    if (type === ColumnType.BOOLEAN) {
        return !!value ? (
            <CheckCircleIcon fontSize={"small"} />
        ) : (
            <RadioButtonUncheckedIcon fontSize={"small"} />
        );
    }
    return value;
};

interface TableBodyCellIf extends TableCellProps {
    displaySkeleton: boolean;
}

const TableBodyCell = (props: TableBodyCellIf) => {
    const { displaySkeleton, ...otherProps } = props;
    if (displaySkeleton) {
        return (
            <TableCell>
                <Skeleton />
            </TableCell>
        );
    }
    return <TableCell {...otherProps} />;
};

const DataTable = ({
    data,
    setAddNewOpen,
    defaultOrderBy = "id",
    tableHeading,
    selected,
    setSelected,
    deleteSelected,
    tableColumns,
    setEditingId,
    loading = false,
    emptyRowsContent,
}: {
    data: DataRow[];
    setAddNewOpen: Function;
    defaultOrderBy?: keyof DataRow;
    tableHeading: string;
    selected: number[];
    setSelected: Function;
    deleteSelected: Function;
    tableColumns: TableColumnIf[];
    setEditingId?: (newId: number | undefined) => void;
    loading?: boolean;
    emptyRowsContent?: React.ReactNode | React.ReactNode[];
}) => {
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof DataRow>(defaultOrderBy);

    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof DataRow
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (id: number) => selected.includes(id);

    const visibleRows: DataRow[] = React.useMemo(
        () =>
            loading && !data.length
                ? Array.from(Array(rowsPerPage)).map((p, placeholderIndex) => {
                      return {
                          id: placeholderIndex,
                      };
                  })
                : stableSort(data, getComparator(order, orderBy)).slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                  ),
        [data, order, orderBy, page, rowsPerPage, loading]
    );

    const emptyRows = rowsPerPage - visibleRows.length;

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }} elevation={10}>
                <EnhancedTableToolbar
                    numSelected={selected.length}
                    setAddNewOpen={setAddNewOpen}
                    title={tableHeading}
                    deleteSelected={deleteSelected}
                    loading={loading}
                />

                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size={dense ? "small" : "medium"}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                            tableColumns={tableColumns}
                            withActions={!!setEditingId}
                            loading={loading}
                        />

                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover={!loading}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    "aria-labelledby": labelId,
                                                }}
                                                onClick={(event) =>
                                                    handleClick(event, row.id)
                                                }
                                                disabled={loading}
                                            />
                                        </TableCell>
                                        {tableColumns.map(
                                            (thisColumn, thisColumnIndex) => {
                                                const value =
                                                    row[thisColumn.id];
                                                return (
                                                    <TableBodyCell
                                                        key={thisColumnIndex}
                                                        padding={
                                                            thisColumn.type ==
                                                            ColumnType.BOOLEAN
                                                                ? "checkbox"
                                                                : undefined
                                                        }
                                                        displaySkeleton={
                                                            loading &&
                                                            !data.length
                                                        }
                                                    >
                                                        {makeTableCellDisplayValue(
                                                            {
                                                                type: thisColumn.type,
                                                                value,
                                                            }
                                                        )}
                                                    </TableBodyCell>
                                                );
                                            }
                                        )}
                                        {!!setEditingId && (
                                            <TableCell
                                                align={"right"}
                                                padding={"checkbox"}
                                            >
                                                <IconButton
                                                    onClick={() => {
                                                        setEditingId(row.id);
                                                    }}
                                                    sx={{
                                                        marginRight: "8px",
                                                    }}
                                                    disabled={loading}
                                                >
                                                    <EditIcon
                                                        fontSize={"small"}
                                                    />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={999}>
                                        {emptyRowsContent}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    disabled={loading}
                />
            </Paper>
            {/* <FormControlLabel
                control={
                    <Switch checked={dense} onChange={handleChangeDense} />
                }
                label="Dense padding"
            /> */}
        </Box>
    );
};

export default DataTable;
