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
import { FormValuesIf, InputIf } from "@/sharedComponents/form";

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

const DataTableWithModals = ({
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
            .then(setItems)
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
            .then(() => {
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
            .then(() => {
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
            .then(() => {
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

export default DataTableWithModals;
