import React, {
    Ref,
    useRef,
    useState,
    FormEvent,
    useImperativeHandle,
    SetStateAction,
    Dispatch,
    useMemo,
} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { getChangedFormValues } from "@/sharedComponents/utilities";

export interface InputIf {
    type: string;
    label: string;
    id: string;
    required?: boolean;
    autoComplete?: boolean;
    disabled?: boolean;
    multiline?: boolean;
}

export interface FormValuesIf {
    [key: string]: string | number | Date | boolean | null;
}

export interface FormIf {
    inputs: InputIf[];
    handleSubmit: Function;
    values: FormValuesIf;
    setValues: Dispatch<SetStateAction<FormValuesIf>>;
    noSubmitButton?: boolean;
    processing?: boolean;
    submitDisabled?: boolean;
    submitChangesOnly?: boolean;
}

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
                        const {
                            type,
                            label,
                            id,
                            required,
                            autoComplete,
                            disabled,
                            multiline,
                        } = thisInput;
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
                            <Box key={index}>
                                {type === "checkbox" ? (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!value}
                                                onChange={handleChange}
                                            />
                                        }
                                        label={label}
                                        required={required}
                                        disabled={disabled || processing}
                                    />
                                ) : (
                                    <TextField
                                        type={type}
                                        label={label}
                                        size={"small"}
                                        name={id}
                                        value={value || ""}
                                        required={required}
                                        autoComplete={
                                            autoComplete ? undefined : "off"
                                        }
                                        onChange={handleChange}
                                        fullWidth={true}
                                        disabled={disabled || processing}
                                        autoFocus={index === 0}
                                        multiline={multiline}
                                        rows={multiline ? 4 : undefined}
                                    />
                                )}
                            </Box>
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
