"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMapEditor } from "@/src/context/MapEditorContext";
import { DynamicForm } from "./ui/DynamicForm";
import { toast } from "sonner";

export const PropertiesSheet = () => {
  const {
    selectedElements,
    setSelectedElements,
    updateElementById,
    deleteElementById,
  } = useMapEditor();

  if (!selectedElements || selectedElements.length === 0) return null;

  const handleDelete = (id?: string) => {
    if (id) {
      deleteElementById(id);
    }
    setSelectedElements((prev) => prev.filter((el) => el.id !== id));
    toast.success("Element deleted successfully");
  };

  const handleApplyChanges = (updatedValues: Record<string, any>) => {
    selectedElements.forEach((el) =>
      updateElementById({ ...el, ...updatedValues }),
    );
    setSelectedElements([]);
    toast.success("Properties updated successfully");
  };

  return (
    <Sheet
      open={selectedElements.length > 0}
      onOpenChange={(open) => !open && setSelectedElements([])}
      modal={false}
    >
      <SheetContent
        side="right"
        className="h-screen overflow-y-auto scrollbar-thin animate-in slide-in-from-right fade-in duration-300 ease-in-out"
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
      >
        <SheetHeader>
          <SheetTitle>Properties</SheetTitle>
        </SheetHeader>

        {selectedElements.length === 1 ? (
          <DynamicForm
            handleDelete={handleDelete}
            type={selectedElements[0].type}
            defaultValues={selectedElements[0]}
            onSubmit={handleApplyChanges}
          />
        ) : (
          <div className="text-sm text-muted-foreground p-2">
            {selectedElements.length} elements selected. You can edit their
            properties together. Note that some properties may not apply to all
            selected elements.
            <DynamicForm
              handleDelete={undefined}
              type="multi"
              defaultValues={{}}
              onSubmit={handleApplyChanges}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
