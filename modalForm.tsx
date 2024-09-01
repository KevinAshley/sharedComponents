import { useRef, Ref, Fragment } from "react";
import Modal from "./modal";
import Form, { FormIf, FormValuesIf } from "./form";

export interface ModalFormIf extends FormIf {
    title: string;
    open: boolean;
    handleClose: () => void;
    defaultValues?: FormValuesIf;
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
}: ModalFormIf) => {
    const initialValues = useRef(values);
    const formRef = useRef<any>();
    const handleSubmitFromModalButton = () => {
        //// handle submit externally
        if (formRef.current) {
            formRef.current.submitTheForm();
        }
    };

    const changesPending = Object.entries(values).reduce(
        (accumulator, [key, value]) => {
            if (initialValues.current[key] != value) {
                accumulator = true;
            }
            return accumulator;
        },
        false
    );

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
        >
            <Form
                inputs={inputs}
                handleSubmit={handleSubmit}
                values={values}
                setValues={setValues}
                noSubmitButton={true}
                ref={formRef}
                processing={processing}
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
