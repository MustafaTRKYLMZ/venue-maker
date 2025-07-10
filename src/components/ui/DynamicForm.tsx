"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { elementFormSchema } from "@/src/config/schemas/elementFormSchema";
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
import { flattenObject } from "@/src/utils/form/flattenObject";
import { getCommonFields } from "@/src/utils/form/getCommonFields";
import { groupFields } from "@/src/utils/form/groupFields";
import { SelectedElement } from "@/src/types/element";
import { applySchemaPatch } from "@/src/utils/helpers/applySchemaPatch"; // 🔥 Burada ekledik
import { commonSectionSchema } from "@/src/config/schemas/commonSectionSchema";
import { getFieldsForMultiTypes } from "@/src/utils/form/getFieldsForMultiTypes";

type DynamicFormProps = {
  type: string;
  defaultValues: SelectedElement | SelectedElement[];
  onSubmit: (values: SelectedElement | SelectedElement[]) => void;
  handleDelete?: (id?: string) => void;
  elementTypes?: string[];
};

export const DynamicForm = ({
  type,
  defaultValues,
  onSubmit,
  handleDelete,
  elementTypes = [],
}: DynamicFormProps) => {
  const isMulti = type === "multi";

  const safeDefaultValues = isMulti
    ? Array.isArray(defaultValues)
      ? defaultValues
      : [defaultValues]
    : defaultValues;

  const multiTypes = isMulti
    ? elementTypes.length > 0
      ? elementTypes
      : Array.from(
          new Set(
            (safeDefaultValues as SelectedElement[]).map((el) => el.type),
          ),
        )
    : [];

  const fields = isMulti
    ? getFieldsForMultiTypes(multiTypes)
    : (elementFormSchema[type] ?? []);

  const groupedFields = groupFields(fields);

  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: isMulti
      ? Array.isArray(safeDefaultValues)
        ? (flattenObject(safeDefaultValues[0]) as Record<string, any>) || {}
        : {}
      : (safeDefaultValues as Record<string, any>) || {},
  });

  useEffect(() => {
    reset(
      isMulti &&
        Array.isArray(safeDefaultValues) &&
        safeDefaultValues.length > 0
        ? (flattenObject(safeDefaultValues[0]) as Record<string, any>) || {}
        : (safeDefaultValues as Record<string, any>) || {},
    );
  }, [defaultValues, reset, isMulti]);

  const getInputType = (key: string, value: any): string => {
    if (key.includes("fill") || key.includes("stroke")) return "color";
    if (typeof value === "number") return "number";
    return "text";
  };

  const handleSubmitForm = (formValues: Record<string, any>) => {
    if (isMulti) {
      const flatDirtyFields = flattenObject(dirtyFields);
      const changedKeys = Object.keys(flatDirtyFields);
      const changedValues = changedKeys.reduce(
        (acc, key) => {
          acc[key] = formValues[key];
          return acc;
        },
        {} as Record<string, any>,
      );

      const updated = (safeDefaultValues as SelectedElement[]).map((el) => {
        const schema =
          elementFormSchema[el.type] ?? commonSectionSchema[el.type] ?? [];
        return applySchemaPatch(el, changedValues, el.type, {
          [el.type]: schema,
        });
      });

      onSubmit(updated);
    } else {
      const el = safeDefaultValues as SelectedElement;
      const schema =
        elementFormSchema[el.type] ?? commonSectionSchema[el.type] ?? [];
      const updated = applySchemaPatch(el, formValues, el.type, {
        [el.type]: schema,
      });

      onSubmit(updated);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4 z-100">
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

      <div className="fixed bottom-2 right-2 flex flex-row gap-2 mt-4 justify-end">
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
