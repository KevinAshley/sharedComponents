import { Fragment, useState } from "react";
import { FormValuesIf } from "./form";
import ModalForm, { ModalFormIf } from "./modalForm";

interface UncontrolledModalFormIf
    extends Omit<ModalFormIf, "values" | "setValues"> {
    initialValues?: FormValuesIf;
}

const UncontrolledModalFormInner = (props: UncontrolledModalFormIf) => {
    const { initialValues, ...modalFormProps } = props;
    const [values, setValues] = useState<FormValuesIf>(initialValues || {});
    return (
        <ModalForm {...modalFormProps} values={values} setValues={setValues} />
    );
};

const UncontrolledModalForm = (props: UncontrolledModalFormIf) => {
    const { open } = props;
    // no need to mount until opened
    return (
        <Fragment>{open && <UncontrolledModalFormInner {...props} />}</Fragment>
    );
};

export default UncontrolledModalForm;
