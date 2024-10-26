"use client";
import { forwardRef, Ref, useState } from "react";
import Form, { FormIf, FormValuesIf } from "./form";

interface UncontrolledFormIf extends Omit<FormIf, "values" | "setValues"> {
    initialValues?: FormValuesIf;
}

const UncontrolledForm = forwardRef(
    (props: UncontrolledFormIf, ref: Ref<{ submitTheForm: () => void }>) => {
        const { initialValues = {}, ...formProps } = props;
        const [values, setValues] = useState<FormValuesIf>(initialValues);
        return (
            <Form
                {...formProps}
                values={values}
                setValues={setValues}
                ref={ref}
            />
        );
    }
);

UncontrolledForm.displayName = "UncontrolledForm";

export default UncontrolledForm;
