import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
    FormValueType,
    InputIf,
} from "@/sharedComponents/formComponents/formInterfaces";

interface InputSwitchIf extends InputIf {
    value: FormValueType;
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
        onChange,
    } = props;
    return (
        <Box>
            {type === "checkbox" ? (
                <FormControlLabel
                    control={<Checkbox checked={!!value} onChange={onChange} />}
                    label={label}
                    required={required}
                    disabled={disabled}
                />
            ) : (
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
            )}
        </Box>
    );
};

export default InputSwitch;
