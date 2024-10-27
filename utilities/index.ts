import { FormValuesIf } from "@/sharedComponents/formComponents/formInterfaces";

export const getChangedFormValues = ({
    values,
    initialValues,
}: {
    values: FormValuesIf;
    initialValues: FormValuesIf;
}) => {
    return Object.entries(values).reduce(
        (accumulator: FormValuesIf, [key, value]) => {
            if (initialValues[key] != value) {
                accumulator[key] = value;
            }
            return accumulator;
        },
        {}
    );
};
