import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useMapEditor } from "../context/MapEditorContext";
import { SelectedElement } from "../types/element";
import { IconButton } from "./ui/IconButton";
import { DynamicForm } from "./ui/DynamicForm";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";

export const PropertiesPanel = () => {
  const [currentProperties, setCurrentProperties] = useState<
    Partial<SelectedElement>
  >({});
  const {
    selectedElement,
    setSelectedElement,
    updateElementById,
    deleteElementById,
  } = useMapEditor();

  useEffect(() => {
    setCurrentProperties(selectedElement || {});
  }, [selectedElement]);

  if (!selectedElement) return null;

  const handleClosePanel = () => setSelectedElement(null);

  const handleChange = (key: string, value: any) => {
    const keys = key.split(".");
    setCurrentProperties((prev) => {
      const updated = { ...prev };
      let temp: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!temp[k]) temp[k] = {};
        temp = temp[k];
      }
      temp[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleApplyChanges = () => {
    if (selectedElement && Object.keys(currentProperties).length > 0) {
      const updatedElement = {
        ...selectedElement,
        ...currentProperties,
      };
      updateElementById(updatedElement as SelectedElement);
      setSelectedElement(null);
      toast.success("Properties updated successfully");
    }
  };

  const handleDelete = () => {
    if (selectedElement) {
      deleteElementById(selectedElement.id);
      setSelectedElement(null);
      toast.success("Element deleted successfully");
    }
  };

  return (
    <div className="fixed right-0 top-32 h-full w-80 bg-white shadow-lg border-l z-0 overflow-y-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Properties</h2>
        <IconButton
          icon={<FaChevronLeft size={20} />}
          tooltipText="Back"
          onClick={handleClosePanel}
        />
      </div>

      {/* Form */}
      <DynamicForm
        data={currentProperties}
        hiddenKeys={["id", "type"]}
        onChange={handleChange}
      />

      <div className="flex gap-2 mt-4">
        <Button onClick={handleApplyChanges}>Apply</Button>
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
    </div>
  );
};
