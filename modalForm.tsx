import { useRef, Ref } from "react";
import Modal from "./modal";
import Form, { FormIf } from "./form";

interface ModalFormIf extends FormIf {
    title: string;
    open: boolean;
    handleClose: () => void;
}

const ModalForm = ({
    title,
    open,
    handleClose,
    handleSubmit,
    inputs,
    values,
    setValues,
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
        setValues({});
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

export default ModalForm;
