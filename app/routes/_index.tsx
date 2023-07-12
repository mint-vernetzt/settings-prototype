import type { V2_MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import classNames from "classnames";
import React from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(50),
});

type Schema = z.infer<typeof schema>;

const defaults: Schema = {
  name: "Jon Doe",
};

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [values, setValues] = React.useState(defaults);
  const [errors, setErrors] = React.useState<{
    [key: string]: string[] | undefined;
  }>({});

  const handleChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const updatedValues = {
      ...values,
      [event.target.name]: event.target.value,
    };
    const result = schema.safeParse(updatedValues);
    if (result.success) {
      setValues(updatedValues);
      setErrors({});
    } else {
      setErrors(result.error.formErrors.fieldErrors);
    }
  };

  return (
    <div className="w-full flex">
      <div className="w-1/2 min-h-screen p-4">
        <Form method="post" onChange={handleChange}>
          <h1 className="text-3xl font-bold underline mb-2">Settings</h1>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={values["name"]}
              className={classNames(
                "input input-bordered input-md w-full max-w-xs",
                errors.name && "input-error"
              )}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt">
                  <span className="text-error">{errors.name.concat(" ")}</span>
                </span>
              </label>
            )}
          </div>
        </Form>
      </div>
      <div className="w-1/2 min-h-screen border-l-2 p-4">
        <h1 className="text-3xl font-bold underline mb-2">Preview</h1>
        <h2 className="text-2xl font-bold">Hello {values["name"]}!👋</h2>
      </div>
    </div>
  );
}
