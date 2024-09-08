import { useRef, Ref, Fragment, useMemo, ReactNode } from "react";
import Modal from "./modal";
import Form, { FormIf, FormValuesIf } from "./form";
import { getChangedFormValues } from "@/sharedComponents/utilities";

export interface ModalFormIf extends FormIf {
    title: string;
    open: boolean;
    handleClose: () => void;
    defaultValues?: FormValuesIf;
    prependContent?: ReactNode;
}

const ModalFormInner = ({
    title,
    open,
    handleClose,
    handleSubmit,
    inputs,
    values,
    setValues,
    defaultValues,
    processing,
    submitChangesOnly,
    prependContent,
}: ModalFormIf) => {
    const initialValues = useRef(values);
    const formRef = useRef<any>();
    const handleSubmitFromModalButton = () => {
        //// handle submit externally
        if (formRef.current) {
            formRef.current.submitTheForm();
        }
    };

    const changesPending = useMemo(() => {
        return !!Object.keys(
            getChangedFormValues({
                values,
                initialValues: initialValues.current,
            })
        ).length;
    }, [values]);

    const handleCloseAndResetValues = () => {
        handleClose();
        setValues(defaultValues || {});
    };

    return (
        <Modal
            title={title}
            open={open}
            handleClose={handleCloseAndResetValues}
            handleSubmit={handleSubmitFromModalButton}
            processing={processing}
            disabled={!changesPending}
            prependContent={prependContent}
        >
            <Form
                inputs={inputs}
                handleSubmit={handleSubmit}
                values={values}
                setValues={setValues}
                noSubmitButton={true}
                ref={formRef}
                processing={processing}
                submitDisabled={!changesPending}
                submitChangesOnly={submitChangesOnly}
            />
        </Modal>
    );
};

const ModalForm = (props: ModalFormIf) => {
    const { open } = props;
    // no need to mount this until opened
    return <Fragment>{open && <ModalFormInner {...props} />}</Fragment>;
};

export default ModalForm;
