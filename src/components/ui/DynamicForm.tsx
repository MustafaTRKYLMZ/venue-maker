"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { elementFormSchema } from "@/src/config/elementFormSchema";
import { useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { containerStyle } from "@/src/config/containerStyle";
import { SelectedElement } from "@/src/types/element";
import { flattenObject } from "@/src/utils/form/flattenObject";
import { getCommonFields } from "@/src/utils/form/getCommonFields";
import { groupFields } from "@/src/utils/form/groupFields";

type DynamicFormProps = {
  type: string;
  defaultValues: Record<string, any> | Record<string, any>[];
  onSubmit: (values: Record<string, any>) => void;
  handleDelete?: (id?: string) => void;
};

export const DynamicForm = ({
  type,
  defaultValues,
  onSubmit,
  handleDelete,
}: DynamicFormProps) => {
  const isMulti = type === "multi";

  const fields = isMulti
    ? getCommonFields(
        (defaultValues as SelectedElement[]).map((element) => ({
          [element.id]: [element],
        })),
      )
    : (elementFormSchema[type] ?? []);

  const groupedFields = groupFields(fields);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: isMulti
      ? Array.isArray(defaultValues)
        ? flattenObject(defaultValues[0])
        : {}
      : defaultValues || {},
  });

  useEffect(() => {
    reset(
      isMulti
        ? flattenObject({ key: [defaultValues] as SelectedElement[] })
        : (defaultValues as Record<string, any>),
    );
  }, [defaultValues, reset, isMulti]);

  const getInputType = (key: string, value: any): string => {
    if (key.includes("fill") || key.includes("stroke")) return "color";
    if (typeof value === "number") return "number";
    return "text";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 z-100">
      <Accordion
        type="multiple"
        defaultValue={["General", "Position", "Style"]}
      >
        {Object.entries(groupedFields).map(([groupName, fields]) => (
          <AccordionItem value={groupName} key={groupName}>
            <AccordionTrigger className="font-bold">
              {groupName}
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {fields.map((field) => (
                <Controller
                  key={field}
                  control={control}
                  name={field}
                  render={({ field: controllerField }) => (
                    <div className={containerStyle}>
                      <Label>{field}</Label>
                      <Input
                        {...controllerField}
                        type={getInputType(field, controllerField.value)}
                        value={controllerField.value ?? ""}
                        onChange={(e) => {
                          const type = getInputType(
                            field,
                            controllerField.value,
                          );
                          let value: any = e.target.value;
                          if (type === "number") value = parseFloat(value) || 0;
                          controllerField.onChange(value);
                        }}
                      />
                    </div>
                  )}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="fixed bottom-2 right-2 flex flex-row gap-2 mt-4 justify-space-between items-space-between">
        <Button type="submit">{isMulti ? "Apply to All" : "Apply"}</Button>

        {!isMulti && handleDelete && (defaultValues as any)?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-700">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  element.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete?.((defaultValues as any)?.id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </form>
  );
};
