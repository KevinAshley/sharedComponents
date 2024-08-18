import React, {
    Dispatch,
    Fragment,
    SetStateAction,
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

type SelectedIdsType = number[];

interface DataTableWithModalsIf {
    tableHeading: string;
    singularItemLabel: string;
    pluralItemsLabel: string;
    items: DataRow[];
    tableColumns: TableColumnIf[];
    deleteSelectedItems: (selectedIds: SelectedIdsType) => Promise<any>;
    addItem: (formValues: FormValuesIf) => Promise<any>;
    editItem: (formValues: FormValuesIf) => Promise<any>;
    itemFormInputs: InputIf[];
    loadItems: () => void;
}

const DataTableWithModals = ({
    tableHeading,
    singularItemLabel,
    pluralItemsLabel,
    items,
    tableColumns,
    deleteSelectedItems,
    addItem,
    editItem,
    itemFormInputs,
    loadItems,
}: DataTableWithModalsIf) => {
    const { setToast } = useContext(MainContext);

    const [formValues, setFormValues] = useState<FormValuesIf>({});
    const [addingNew, setAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [selectedIds, setSelectedIds] = useState<SelectedIdsType>([]);

    const loadItemsAndResetFormValues = () => {
        loadItems();
        setFormValues({});
    };

    const handleAddItem = () => {
        addItem(formValues)
            .then(() => {
                setAddingNew(false);
                loadItemsAndResetFormValues();
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
            });
    };

    const handleEditItem = () => {
        editItem(formValues)
            .then(() => {
                setEditingId(undefined);
                loadItemsAndResetFormValues();
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
            });
    };

    const handleDeleteItems = () => {
        const deletionCount = selectedIds.length;
        deleteSelectedItems(selectedIds)
            .then(() => {
                setSelectedIds([]);
                loadItems();
                setToast({
                    message: `Successfully deleted ${deletionCount} ${pluralItemsLabel}!`,
                    variant: toastVariants.SUCCESS,
                });
            })
            .catch((err) => {
                setToast({
                    message: err.message,
                    variant: toastVariants.ERROR,
                });
            });
    };

    const handleCloseAddNewModal = () => {
        setAddingNew(false);
        setFormValues({});
    };

    const editingItem = useMemo(() => {
        return editingId
            ? items.find((item) => item.id == editingId)
            : undefined;
    }, [editingId, items]);

    useEffect(() => {
        if (editingItem) {
            setFormValues(editingItem);
        } else {
            setFormValues({});
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
                deleteSelected={handleDeleteItems}
                tableColumns={tableColumns}
                defaultOrderBy={"id"}
                setEditingId={setEditingId}
            />
            <ModalForm
                title={`Add New ${singularItemLabel}`}
                open={addingNew}
                handleClose={handleCloseAddNewModal}
                handleSubmit={handleAddItem}
                inputs={itemFormInputs}
                values={formValues}
                setValues={setFormValues}
            />
            <ModalForm
                title={`Edit ${singularItemLabel}`}
                open={!!editingId}
                handleClose={() => setEditingId(undefined)}
                handleSubmit={handleEditItem}
                inputs={itemFormInputs}
                values={formValues}
                setValues={setFormValues}
            />
        </Fragment>
    );
};

export default DataTableWithModals;
