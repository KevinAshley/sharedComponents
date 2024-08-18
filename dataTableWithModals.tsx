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
    toastVariants,
} from "@/sharedComponents/contexts/mainContext";
import ModalForm from "@/sharedComponents/modalForm";
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
    editItem: (formValues: FormValuesIf) => Promise<any>;
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

    const [formValues, setFormValues] = useState<FormValuesIf>({});
    const [deleteFormValues, setDeleteFormValues] = useState<FormValuesIf>({});
    const [addingNew, setAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<SelectedIdsType>([]);

    const [deleting, setDeleting] = useState(false);

    const loadItems = useCallback(() => {
        setLoading(true);
        getItems()
            .then(setItems)
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: toastVariants.ERROR,
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

    const handleAddItem = () => {
        setProcessing(true);
        addItem(formValues)
            .then(() => {
                handleCloseAddNewModal();
                loadItems();
                setToast({
                    message: `Successfully added new ${singularItemLabel}!`,
                    variant: toastVariants.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: toastVariants.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleEditItem = () => {
        setProcessing(true);
        editItem(formValues)
            .then(() => {
                handleCloseEditingModal();
                loadItems();
                setToast({
                    message: `Successfully edited ${singularItemLabel}!`,
                    variant: toastVariants.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: toastVariants.ERROR,
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
                    variant: toastVariants.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: toastVariants.ERROR,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const handleCloseAddNewModal = () => {
        setAddingNew(false);
        setFormValues({});
    };

    const handleCloseEditingModal = () => {
        setEditingId(undefined);
        setFormValues({});
    };

    const handleCloseDeleteModal = () => {
        setDeleting(false);
        setDeleteFormValues({});
    };

    const editingItem = useMemo(() => {
        return editingId
            ? items.find((item) => item.id == editingId)
            : undefined;
    }, [editingId, items]);

    useEffect(() => {
        if (editingItem) {
            setFormValues(editingItem);
        }
    }, [editingItem]);

    return (
        <Fragment>
            <DataTable
                title={tableHeading}
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
            <ModalForm
                title={`Add New ${singularItemLabel}`}
                open={addingNew}
                handleClose={handleCloseAddNewModal}
                handleSubmit={handleAddItem}
                inputs={itemFormInputs}
                values={formValues}
                setValues={setFormValues}
                processing={processing}
            />
            <ModalForm
                title={`Edit ${singularItemLabel}`}
                open={!!editingId}
                handleClose={handleCloseEditingModal}
                handleSubmit={handleEditItem}
                inputs={itemFormInputs}
                values={formValues}
                setValues={setFormValues}
                processing={processing}
            />
            <ModalForm
                title={`Delete ${getItemsCountWithSuffix({
                    count: selectedIds.length,
                    singularItemLabel,
                    pluralItemsLabel,
                })}?`}
                open={deleting}
                handleClose={handleCloseDeleteModal}
                handleSubmit={handleDeleteItems}
                inputs={deleteFormInputs}
                values={deleteFormValues}
                setValues={setDeleteFormValues}
                processing={processing}
            />
        </Fragment>
    );
};

export default DataTableWithModals;
