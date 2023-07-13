import type { V2_MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import classNames from "classnames";
import React from "react";
import { z } from "zod";
import Frame from "~/components/Frame";

const schema = z.object({
  name: z.string().min(1).max(50),
});

type Schema = z.infer<typeof schema>;

const defaults: Schema = {
  name: "Jon Doe",
};

export function headers({
  loaderHeaders,
  parentHeaders,
}: {
  loaderHeaders: Headers;
  parentHeaders: Headers;
}) {
  console.log(
    "This is an example of how to set caching headers for a route, feel free to change the value of 60 seconds or remove the header"
  );
  return {
    // This is an example of how to set caching headers for a route
    // For more info on headers in Remix, see: https://remix.run/docs/en/v1/route/headers
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };
}

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
  const ref = React.useRef<HTMLDivElement>(null);
  const [breakpoint, setBreakpoint] = React.useState<
    "sm" | "md" | "lg" | "xl" | "2xl" | undefined
  >();

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

  const [cssLink, setCssLink] = React.useState<HTMLLinkElement | null>(null);

  React.useEffect(() => {
    if (window) {
      const css = document.querySelector("head > link");
      if (css) {
        setCssLink(css as HTMLLinkElement);
      }
    }
  }, []);

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    function resizeHandler() {
      console.log("resizeHandler");
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setDimensions({ width, height });
        if (width < 640) {
          setBreakpoint(undefined);
        } else if (width < 768) {
          setBreakpoint("sm");
        } else if (width < 1024) {
          setBreakpoint("md");
        } else if (width < 1280) {
          setBreakpoint("lg");
        } else if (width < 1536) {
          setBreakpoint("xl");
        } else {
          setBreakpoint("2xl");
        }
      }
    }
    if (window) {
      window.addEventListener("resize", resizeHandler);
      resizeHandler();
    }
    return () => {
      if (window) {
        window.removeEventListener("resize", resizeHandler);
      }
    };
  }, []);

  return (
    <>
      <div className="w-full flex flex-nowrap">
        <input
          type="checkbox"
          className="toggle toggle-primary absolute top-0 right-0 m-4 peer sm:hidden"
        />
        <div className="w-full shrink-0 sm:w-1/2 sm:shrink min-h-screen p-4 peer-checked:hidden">
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
                    <span className="text-error">
                      {errors.name.concat(" ")}
                    </span>
                  </span>
                </label>
              )}
            </div>
          </Form>
        </div>
        <div ref={ref} className="w-full sm:w-1/2 min-h-screen sm:border-l-2">
          <Frame title="preview-iframe" className="w-full h-full">
            {cssLink && <link rel="stylesheet" href={cssLink.href} />}
            <div className="w-full h-full p-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold">
                Hello {values["name"]}!👋
              </h2>
              <div className="absolute bottom-0 right-0 p-4 bg-slate-700">
                {dimensions.width} x {dimensions.height}
                {breakpoint !== undefined && `(${breakpoint})`}
              </div>
            </div>
          </Frame>
        </div>
      </div>
    </>
  );
}
