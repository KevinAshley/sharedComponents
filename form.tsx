import React, {
    Ref,
    useRef,
    useState,
    FormEvent,
    useImperativeHandle,
} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";

export interface InputIf {
    type: string;
    label: string;
    id: string;
    required?: boolean;
}

export interface FormValuesIf {
    [key: string]: string | number | Date | boolean | null;
}

export interface FormIf {
    inputs: InputIf[];
    handleSubmit: Function;
    values: FormValuesIf;
    setValues: Function;
    noSubmitButton?: boolean;
    processing?: boolean;
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
        }: FormIf,
        ref: Ref<{ submitTheForm: () => void }>
    ) => {
        const [hpCheckboxIsChecked, setHpCheckboxIsChecked] = useState(false);
        const randomNumberString = Math.floor(
            Math.random() * 100000
        ).toString();
        const formRef = useRef<any>();
        const handleChangeHpInput = () => {
            setHpCheckboxIsChecked(!hpCheckboxIsChecked);
        };

        const handleHpSubmit = (e: FormEvent) => {
            e.preventDefault();
            // do nothing, this is a bot
        };

        const handleSubmitWrapped = (e: FormEvent) => {
            e.preventDefault();
            handleSubmit();
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
                        const { type, label, id, required } = thisInput;
                        const value = values[id];
                        const handleChange = (
                            e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                            setValues({
                                ...values,
                                [id]: e.target.value,
                            });
                        };
                        return (
                            <Box key={index}>
                                {type === "checkbox" ? (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value={value}
                                                onChange={handleChange}
                                            />
                                        }
                                        label={label}
                                        required={required}
                                        disabled={processing}
                                    />
                                ) : (
                                    <TextField
                                        type={type}
                                        label={label}
                                        size={"small"}
                                        name={id}
                                        value={value || ""}
                                        required={required}
                                        onChange={handleChange}
                                        fullWidth={true}
                                        disabled={processing}
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
                            autoComplete={randomNumberString}
                            checked={hpCheckboxIsChecked}
                            onChange={handleChangeHpInput}
                        />
                    </Box>
                    {!noSubmitButton && (
                        <Box>
                            <Button
                                type={"submit"}
                                variant={"contained"}
                                sx={{ width: "100%" }}
                                disabled={processing}
                            >
                                Submit
                            </Button>
                        </Box>
                    )}
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
