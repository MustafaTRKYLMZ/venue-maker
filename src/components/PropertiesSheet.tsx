// components/PropertiesSheet.tsx
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
    selectedElement,
    setSelectedElement,
    updateElementById,
    deleteElementById,
  } = useMapEditor();

  if (!selectedElement) return null;

  const handleDelete = () => {
    deleteElementById(selectedElement.id);
    setSelectedElement(null);
    toast.success("Element deleted successfully");
  };

  const handleApplyChanges = (updatedValues: Record<string, any>) => {
    updateElementById({ ...selectedElement, ...updatedValues });
    setSelectedElement(null);
    toast.success("Properties updated successfully");
  };

  return (
    <Sheet
      open={!!selectedElement}
      onOpenChange={(open) => !open && setSelectedElement(null)}
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
        <DynamicForm
          handleDelete={handleDelete}
          type={selectedElement.type}
          defaultValues={selectedElement}
          onSubmit={handleApplyChanges}
        />
      </SheetContent>
    </Sheet>
  );
};
