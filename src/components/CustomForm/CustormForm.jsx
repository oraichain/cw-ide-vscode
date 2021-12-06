import { useRef } from 'react';
import Form from '@rjsf/antd';
import 'antd/dist/antd.css';

const CustomSelect =
    (selectionRef) =>
        ({ options: { enumOptions }, value, onChange, ...props }) => {
            console.log("value: ", value);
            return (
                <select
                    {...props}
                    onChange={(e) => {
                        selectionRef.current = +e.target.value;
                        onChange(+e.target.value);
                    }}
                    value={value}
                >
                    {enumOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        };

const CustomForm = ({ schema, onSubmit }) => {
    const selection = useRef(0);
    const widgets = {
        SelectWidget: CustomSelect(selection)
    };

    const handleError = (error) => {
        console.log("errors: ", error);
    }

    return (
        <Form
            widgets={widgets}
            schema={schema}
            onSubmit={({ formData, schema }) => {
                const schemaItem = (schema.oneOf || schema.anyOf)[selection.current];
                const schemaKey = schemaItem.required[0];
                onSubmit?.({ [schemaKey]: formData[schemaKey] });
            }}
            noValidate
            onError={handleError}
        />
    );
};

export default CustomForm;