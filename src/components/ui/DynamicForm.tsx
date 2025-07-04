// components/ui/DynamicForm.tsx
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

type DynamicFormProps = {
  type: string;
  defaultValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  handleDelete: () => void;
};

const groupFields = (fields: string[]) => {
  const groups: Record<string, string[]> = {
    General: [],
    Position: [],
    Style: [],
  };

  fields.forEach((field) => {
    if (field.startsWith("position.")) {
      groups.Position.push(field);
    } else if (
      field.includes("fill") ||
      field.includes("stroke") ||
      field === "rotation"
    ) {
      groups.Style.push(field);
    } else {
      groups.General.push(field);
    }
  });

  return groups;
};

export const DynamicForm = ({
  type,
  defaultValues,
  onSubmit,
  handleDelete,
}: DynamicFormProps) => {
  const fields = elementFormSchema[type] ?? [];
  const groupedFields = groupFields(fields);

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

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
        <Button type="submit">Apply</Button>
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
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
};
