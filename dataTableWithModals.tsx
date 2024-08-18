import React, { Dispatch, Fragment, SetStateAction } from "react";
import DataTable, {
    DataRow,
    TableColumnIf,
} from "@/sharedComponents/dataTable";
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
    addNew: boolean;
    setAddNew: Dispatch<SetStateAction<boolean>>;
    editingId: number | undefined;
    setEditingId: Dispatch<SetStateAction<number | undefined>>;
    addItem: Function;
    editItem: Function;
    itemFormInputs: InputIf[];
    formValues: FormValuesIf;
    setFormValues: Dispatch<SetStateAction<FormValuesIf>>;
}

const DataTableWithModals = ({
    tableHeading,
    singularItemLabel,
    items,
    tableColumns,
    selectedIds,
    setSelectedIds,
    deleteSelectedItems,
    addNew,
    setAddNew,
    editingId,
    setEditingId,
    addItem,
    editItem,
    itemFormInputs,
    formValues,
    setFormValues,
}: DataTableWithModalsIf) => {
    return (
        <Fragment>
            <DataTable
                title={tableHeading}
                data={items}
                setAddNewOpen={setAddNew}
                selected={selectedIds}
                setSelected={setSelectedIds}
                deleteSelected={deleteSelectedItems}
                tableColumns={tableColumns}
                defaultOrderBy={"id"}
                setEditingId={setEditingId}
            />
            <ModalForm
                title={`Add New ${singularItemLabel}`}
                open={addNew}
                handleClose={() => setAddNew(false)}
                handleSubmit={addItem}
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
