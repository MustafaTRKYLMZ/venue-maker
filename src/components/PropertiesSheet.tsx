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

import { updateElementsById as updateElementsHelper } from "@/src/utils/helpers/updateElementsById";
import { updateElementById as updateElementHelper } from "@/src/utils/helpers/updateElementById";
import { SelectedElement } from "../types/element";

export const PropertiesSheet = () => {
  const {
    selectedElements,
    setSelectedElements,
    setVenue,
    venue,
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

  const safeMergeElement = (
    original: SelectedElement,
    updates: Record<string, any>,
  ): SelectedElement => {
    const allowedKeys = Object.keys(original);
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([key]) => allowedKeys.includes(key)),
    );
    return { ...original, ...filteredUpdates };
  };

  const handleApplyChanges = (updated: SelectedElement | SelectedElement[]) => {
    if (!venue) return;

    let updatedVenue;

    if (Array.isArray(updated)) {
      updatedVenue = updateElementsHelper(venue, updated); //multi
    } else {
      updatedVenue = updateElementHelper(venue, updated); // single
    }
    setVenue(updatedVenue);
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
              elementTypes={selectedElements.map((el) => el.type)}
              defaultValues={selectedElements}
              onSubmit={handleApplyChanges}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
