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

interface DataTableWithModalsIf {
    tableHeading: string;
    singularItemLabel: string;
    items: DataRow[];
    tableColumns: TableColumnIf[];
    selectedIds: number[];
    setSelectedIds: Dispatch<SetStateAction<number[]>>;
    deleteSelectedItems: Function;
    addItem: () => Promise<any>;
    editItem: () => Promise<any>;
    itemFormInputs: InputIf[];
    formValues: FormValuesIf;
    setFormValues: Dispatch<SetStateAction<FormValuesIf>>;
    loadItems: () => void;
}

const DataTableWithModals = ({
    tableHeading,
    singularItemLabel,
    items,
    tableColumns,
    selectedIds,
    setSelectedIds,
    deleteSelectedItems,
    addItem,
    editItem,
    itemFormInputs,
    formValues,
    setFormValues,
    loadItems,
}: DataTableWithModalsIf) => {
    const { setToast } = useContext(MainContext);

    const [addingNew, setAddingNew] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);

    const loadItemsAndResetFormValues = () => {
        loadItems();
        setFormValues({});
    };

    const handleAddItem = () => {
        addItem()
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
        editItem()
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
                deleteSelected={deleteSelectedItems}
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
