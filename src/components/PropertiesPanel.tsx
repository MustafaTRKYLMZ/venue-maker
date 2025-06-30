// components/PropertiesPanel.tsx
import React, { useState, useEffect } from "react";
import { BaseElement } from "@/src/types/baseElement";

interface PropertiesPanelProps {
  selectedElement: BaseElement | null;
  onUpdateElement: (updatedElement: BaseElement) => void;
  onDeleteElement: (elementId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
}) => {
  const [currentProperties, setCurrentProperties] = useState<
    Partial<BaseElement>
  >({});

  // Update internal state when selectedElement changes
  useEffect(() => {
    if (selectedElement) {
      setCurrentProperties(selectedElement);
    } else {
      setCurrentProperties({});
    }
  }, [selectedElement]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProperties((prev) => ({
      ...prev,
      [name]:
        name === "x" ||
        name === "y" ||
        name === "width" ||
        name === "height" ||
        name === "fontSize" ||
        name === "strokeWidth"
          ? parseFloat(value) || 0 // Convert to number, default to 0 if invalid
          : value,
    }));
  };

  // Apply changes to the selected element
  const handleApplyChanges = () => {
    if (selectedElement && Object.keys(currentProperties).length > 0) {
      onUpdateElement({ ...selectedElement, ...currentProperties });
    }
  };

  // Delete the selected element
  const handleDelete = () => {
    if (selectedElement) {
      onDeleteElement(selectedElement.id);
    }
  };

  if (!selectedElement) {
    return (
      <div className="p-4 text-gray-600">
        <h2 className="text-xl font-semibold mb-4">Properties</h2>
        <p>Select an element to view its properties.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Properties</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID:</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
            value={selectedElement.id}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type:
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-gray-100"
            value={selectedElement.type}
            readOnly
          />
        </div>

        {/* Common properties for all types */}
        {typeof currentProperties.x === "number" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              X:
            </label>
            <input
              type="number"
              name="x"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.x}
              onChange={handleChange}
            />
          </div>
        )}
        {typeof currentProperties.y === "number" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Y:
            </label>
            <input
              type="number"
              name="y"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.y}
              onChange={handleChange}
            />
          </div>
        )}
        {typeof currentProperties.width === "number" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Width:
            </label>
            <input
              type="number"
              name="width"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.width}
              onChange={handleChange}
            />
          </div>
        )}
        {typeof currentProperties.height === "number" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height:
            </label>
            <input
              type="number"
              name="height"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.height}
              onChange={handleChange}
            />
          </div>
        )}
        {currentProperties.text !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Text:
            </label>
            <input
              type="text"
              name="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.text}
              onChange={handleChange}
            />
          </div>
        )}
        {typeof currentProperties.fontSize === "number" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Font Size:
            </label>
            <input
              type="number"
              name="fontSize"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.fontSize}
              onChange={handleChange}
            />
          </div>
        )}
        {currentProperties.fill !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fill Color:
            </label>
            <input
              type="color"
              name="fill"
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.fill}
              onChange={handleChange}
            />
          </div>
        )}
        {currentProperties.stroke !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stroke Color:
            </label>
            <input
              type="color"
              name="stroke"
              className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.stroke}
              onChange={handleChange}
            />
          </div>
        )}
        {typeof currentProperties.strokeWidth === "number" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stroke Width:
            </label>
            <input
              type="number"
              name="strokeWidth"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={currentProperties.strokeWidth}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="mt-4 space-y-2">
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleApplyChanges}
          >
            Apply Changes
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={handleDelete}
          >
            Delete Element
          </button>
        </div>
      </div>
    </div>
  );
};
