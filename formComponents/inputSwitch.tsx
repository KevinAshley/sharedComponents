import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
    FormValueType,
    InputIf,
} from "@/sharedComponents/formComponents/formInterfaces";
import TurnstileInput from "./turnstileInput";

interface InputSwitchIf extends InputIf {
    value: FormValueType;
    setValue: (p: FormValueType) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
}

const InputSwitch = (props: InputSwitchIf) => {
    const {
        type,
        label,
        id,
        required,
        autoComplete,
        disabled,
        multiline,
        autoFocus,
        value,
        setValue,
        onChange,
    } = props;
    switch (type) {
        case "turnstile":
            return <TurnstileInput value={value} setValue={setValue} />;
        case "checkbox":
            const handleChange = () => {
                setValue(!value);
            };
            return (
                <Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!value}
                                onChange={handleChange}
                            />
                        }
                        label={label}
                        required={required}
                        disabled={disabled}
                    />
                </Box>
            );
        default:
            return (
                <Box>
                    <TextField
                        type={type}
                        label={label}
                        size={"small"}
                        name={id}
                        value={value || ""}
                        required={required}
                        autoComplete={autoComplete ? undefined : "off"}
                        onChange={onChange}
                        fullWidth={true}
                        disabled={disabled}
                        autoFocus={autoFocus}
                        multiline={multiline}
                        rows={multiline ? 4 : undefined}
                    />
                </Box>
            );
    }
};

export default InputSwitch;
