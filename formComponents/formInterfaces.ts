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

export interface InputIf {
    type: "checkbox" | "email" | "text" | "password" | "turnstile";
    label: string;
    id: string;
    required?: boolean;
    autoComplete?: boolean;
    disabled?: boolean;
    multiline?: boolean;
}

export type FormValueType = string | number | Date | boolean | null;

export interface FormValuesIf {
    [key: string]: FormValueType;
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
