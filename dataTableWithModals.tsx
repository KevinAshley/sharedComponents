"use client";

import React, {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import DataTable, {
    DataRow,
    TableColumnIf,
} from "@/sharedComponents/dataTable";
import {
    MainContext,
    ToastVariant,
} from "@/sharedComponents/contexts/mainContext";
import UncontrolledModalForm from "@/sharedComponents/modalFormUncontrolled";
import {
    FormValuesIf,
    InputIf,
} from "@/sharedComponents/formComponents/formInterfaces";
import { UserContext } from "@/sharedComponents/contexts/userContext";
import Box from "@mui/material/Box";
import ReportIcon from "@mui/icons-material/Report";
import Typography from "@mui/material/Typography";
import { Button, ButtonGroup } from "@mui/material";

const getItemsCountWithSuffix = ({
    count,
    singularItemLabel,
    pluralItemsLabel,
}: {
    count: number;
    singularItemLabel: string;
    pluralItemsLabel: string;
}) => {
    return `${count} ${count > 1 ? pluralItemsLabel : singularItemLabel}`;
};

const deleteFormInputs: InputIf[] = [
    {
        type: "checkbox",
        label: "Yes, confirm deletion",
        id: "confirmation",
        required: true,
    },
];

type SelectedIdsType = number[];

interface DataTableWithModalsIf {
    tableHeading: string;
    singularItemLabel: string;
    pluralItemsLabel: string;
    tableColumns: TableColumnIf[];
    getItems: () => Promise<any>;
    deleteSelectedItems: (selectedIds: SelectedIdsType) => Promise<any>;
    addItem: (formValues: FormValuesIf) => Promise<any>;
    editItem: (params: {
        id: number;
        changedValues: FormValuesIf;
    }) => Promise<any>;
    itemFormInputs: InputIf[];
}

const DataTableWithModalsInner = ({
    tableHeading,
    singularItemLabel,
    pluralItemsLabel,
    tableColumns,
    getItems,
    deleteSelectedItems,
    addItem,
    editItem,
    itemFormInputs,
}: DataTableWithModalsIf) => {
    const { setToast } = useContext(MainContext);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const [items, setItems] = useState<DataRow[]>([]);

    const [addingNew, setAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<SelectedIdsType>([]);
    const [deleting, setDeleting] = useState(false);

    const editingItem = useMemo(() => {
        return editingId
            ? items.find((item) => item.id == editingId)
            : undefined;
    }, [items, editingId]);

    const loadItems = useCallback(() => {
        setLoading(true);
        getItems()
            .then((response) => {
                if (!response.success) {
                    throw new Error(response.errorMessage);
                }
                setItems(response.items);
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => setLoading(false));
    }, [getItems, setToast]);

    useEffect(() => {
        if (!initialized) {
            loadItems();
            setInitialized(true);
        }
    }, [initialized, loadItems]);

    const handleAddItem = (values: FormValuesIf) => {
        setProcessing(true);
        addItem(values)
            .then((response) => {
                if (!response.success) {
                    throw new Error(response.errorMessage);
                }
                handleCloseAddNewModal();
                loadItems();
                setToast({
                    message: `Successfully added new ${singularItemLabel}!`,
                    variant: ToastVariant.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleEditItem = (changedValues: FormValuesIf) => {
        setProcessing(true);
        editItem({
            id: editingItem?.id || -1, // negative ID will result in an intentional error
            changedValues,
        })
            .then((response) => {
                if (!response.success) {
                    throw new Error(response.errorMessage);
                }
                handleCloseEditingModal();
                loadItems();
                setToast({
                    message: `Successfully edited ${singularItemLabel}!`,
                    variant: ToastVariant.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleDeleteItems = () => {
        setProcessing(true);
        const deletionCount = selectedIds.length;
        deleteSelectedItems(selectedIds)
            .then((response) => {
                if (!response.success) {
                    throw new Error(response.errorMessage);
                }
                setSelectedIds([]);
                loadItems();
                handleCloseDeleteModal();
                setToast({
                    message: `Successfully deleted ${getItemsCountWithSuffix({
                        count: deletionCount,
                        singularItemLabel,
                        pluralItemsLabel,
                    })}!`,
                    variant: ToastVariant.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: ToastVariant.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleCloseAddNewModal = () => {
        setAddingNew(false);
    };

    const handleCloseEditingModal = () => {
        setEditingId(undefined);
    };

    const handleCloseDeleteModal = () => {
        setDeleting(false);
    };

    return (
        <Fragment>
            <DataTable
                tableHeading={tableHeading}
                data={items}
                setAddNewOpen={setAddingNew}
                selected={selectedIds}
                setSelected={setSelectedIds}
                deleteSelected={() => setDeleting(true)}
                tableColumns={tableColumns}
                defaultOrderBy={"id"}
                setEditingId={setEditingId}
                loading={loading}
            />
            <UncontrolledModalForm
                title={`Add New ${singularItemLabel}`}
                open={addingNew}
                handleClose={handleCloseAddNewModal}
                handleSubmit={handleAddItem}
                inputs={itemFormInputs}
                processing={processing}
                initialValues={{
                    name: "",
                    email: "",
                    password: "",
                }}
            />
            <UncontrolledModalForm
                title={`Edit ${singularItemLabel}`}
                open={!!editingItem}
                handleClose={handleCloseEditingModal}
                handleSubmit={handleEditItem}
                inputs={itemFormInputs}
                processing={processing}
                initialValues={editingItem}
                submitChangesOnly={true}
            />
            <UncontrolledModalForm
                title={`Delete ${getItemsCountWithSuffix({
                    count: selectedIds.length,
                    singularItemLabel,
                    pluralItemsLabel,
                })}?`}
                open={deleting}
                handleClose={handleCloseDeleteModal}
                handleSubmit={handleDeleteItems}
                inputs={deleteFormInputs}
                processing={processing}
                initialValues={{
                    confirmation: false,
                }}
            />
        </Fragment>
    );
};

const DataTableWithModals = (props: DataTableWithModalsIf) => {
    const { tableHeading, tableColumns } = props;
    const { user, setLoginModalIsOpen, setSignupModalIsOpen } =
        useContext(UserContext);
    if (!user) {
        return (
            <DataTable
                tableHeading={tableHeading}
                tableColumns={tableColumns}
                setAddNewOpen={setSignupModalIsOpen}
                data={[]}
                selected={[]}
                setSelected={() => {}}
                deleteSelected={() => {}}
                emptyRowsContent={
                    <Box sx={{ position: "relative" }}>
                        <Box
                            sx={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ReportIcon
                                sx={{ fontSize: "10rem", marginBottom: "1rem" }}
                            />
                            <Typography variant={"h2"} component={"h2"} mb={2}>
                                Login Required
                            </Typography>
                            <Box>
                                Only logged-in users can use the {tableHeading}.
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "1rem",
                                    marginTop: "1rem",
                                }}
                            >
                                <Button
                                    variant={"outlined"}
                                    color={"inherit"}
                                    onClick={() => setLoginModalIsOpen(true)}
                                >
                                    Log In
                                </Button>
                                <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    onClick={() => setSignupModalIsOpen(true)}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                }
            />
        );
    }
    return (
        <DataTableWithModalsInner
            {...props}
            key={user.id}
            // ^ force the table to re-mount if the user changes
        />
    );
};

export default DataTableWithModals;
