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
    const formRef = useRef<any>();
    const handleSubmitFromModalButton = () => {
        //// handle submit externally
        if (formRef.current) {
            formRef.current.submitTheForm();
        }
    };
    return (
        <Modal
            title={title}
            open={open}
            handleClose={handleClose}
            handleSubmit={handleSubmitFromModalButton}
            processing={processing}
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
