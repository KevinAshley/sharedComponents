import React, {
    Ref,
    useRef,
    useState,
    FormEvent,
    useImperativeHandle,
    useMemo,
} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { getChangedFormValues } from "@/sharedComponents/utilities";
import { FormIf } from "@/sharedComponents/formComponents/formInterfaces";
import InputSwitch from "./formComponents/inputSwitch";

const Form = React.forwardRef(
    (
        {
            inputs,
            handleSubmit,
            values,
            setValues,
            noSubmitButton,
            processing,
            submitDisabled,
            submitChangesOnly,
        }: FormIf,
        ref: Ref<{ submitTheForm: () => void }>
    ) => {
        const initialValues = useRef(values);

        const [hpCheckboxIsChecked, setHpCheckboxIsChecked] = useState(false);
        const formRef = useRef<any>();

        const changedValues = useMemo(() => {
            return getChangedFormValues({
                values,
                initialValues: initialValues.current,
            });
        }, [values]);

        const handleChangeHpInput = () => {
            setHpCheckboxIsChecked(!hpCheckboxIsChecked);
        };

        const handleHpSubmit = (e: FormEvent) => {
            e.preventDefault();
            // do nothing, this is a bot
        };

        const handleSubmitWrapped = (e: FormEvent) => {
            e.preventDefault();
            handleSubmit(submitChangesOnly ? changedValues : values);
        };

        useImperativeHandle(ref, () => ({
            submitTheForm() {
                if (formRef.current) {
                    formRef.current.requestSubmit();
                }
            },
        }));

        return (
            <form
                onSubmit={
                    hpCheckboxIsChecked ? handleHpSubmit : handleSubmitWrapped
                }
                ref={formRef}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        width: "250px",
                        opacity: processing ? 0.5 : 1,
                    }}
                >
                    {inputs.map((thisInput, index) => {
                        const { type, id, disabled } = thisInput;
                        const value = values[id];
                        const handleChange = (
                            e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            setValues((previousValues) => {
                                return {
                                    ...previousValues,
                                    [id]:
                                        type === "checkbox"
                                            ? !previousValues[id]
                                            : e.target.value,
                                };
                            });
                        };
                        return (
                            <InputSwitch
                                key={index}
                                {...thisInput}
                                value={value}
                                onChange={handleChange}
                                disabled={disabled || processing}
                                autoFocus={index == 0}
                            />
                        );
                    })}
                    <Box
                        sx={{
                            display: "none",
                        }}
                    >
                        <input
                            // this is a honeypot input
                            type={"checkbox"}
                            autoComplete={"robots"}
                            checked={hpCheckboxIsChecked}
                            onChange={handleChangeHpInput}
                        />
                    </Box>
                    <Box
                        sx={noSubmitButton ? { display: "none" } : undefined}
                        // we need the submit button here always so that the enter key submits the form
                    >
                        <Button
                            type={"submit"}
                            variant={"contained"}
                            sx={{ width: "100%" }}
                            disabled={submitDisabled || processing}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
                {processing && (
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </form>
        );
    }
);

Form.displayName = "Form";

export default Form;
