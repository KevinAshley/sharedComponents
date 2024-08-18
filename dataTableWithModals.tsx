import React, {
    Dispatch,
    Fragment,
    SetStateAction,
    useContext,
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
import { InputIf } from "@/sharedComponents/form";

interface FormValuesIf {
    [key: string]: string | number | boolean;
}

interface DataTableWithModalsIf {
    tableHeading: string;
    singularItemLabel: string;
    items: DataRow[];
    tableColumns: TableColumnIf[];
    selectedIds: number[];
    setSelectedIds: Dispatch<SetStateAction<number[]>>;
    deleteSelectedItems: Function;
    editingId: number | undefined;
    setEditingId: Dispatch<SetStateAction<number | undefined>>;
    addItem: () => Promise<any>;
    editItem: Function;
    itemFormInputs: InputIf[];
    formValues: FormValuesIf;
    setFormValues: Dispatch<SetStateAction<FormValuesIf>>;
    reloadItems: () => void;
}

const DataTableWithModals = ({
    tableHeading,
    singularItemLabel,
    items,
    tableColumns,
    selectedIds,
    setSelectedIds,
    deleteSelectedItems,
    editingId,
    setEditingId,
    addItem,
    editItem,
    itemFormInputs,
    formValues,
    setFormValues,
    reloadItems,
}: DataTableWithModalsIf) => {
    const { setToast } = useContext(MainContext);

    const [addingNew, setAddingNew] = useState(false);

    const handleAddItem = () => {
        addItem()
            .then(() => {
                setAddingNew(false);
                reloadItems();
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
                handleClose={() => setAddingNew(false)}
                handleSubmit={handleAddItem}
                inputs={itemFormInputs}
                values={formValues}
                setValues={setFormValues}
            />
            <ModalForm
                title={`Edit ${singularItemLabel}`}
                open={!!editingId}
                handleClose={() => setEditingId(undefined)}
                handleSubmit={editItem}
                inputs={itemFormInputs}
                values={formValues}
                setValues={setFormValues}
            />
        </Fragment>
    );
};

export default DataTableWithModals;
