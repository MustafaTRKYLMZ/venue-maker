// app/editor/[mapId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from "uuid";

// Firestore imports
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

// Import types
import { MapElement } from "@/src/types/mapElement";
import { ElementType } from "@/src/types/element";

// Import components
import { PropertiesPanel } from "@/src/components/PropertiesPanel";
import { LeftPanelTools } from "@/src/components/LeftPanelTools";
import { MapEditorHeader } from "@/src/components/MapEditorHeader";

// Dynamically import MapEditorCanvas
const DynamicMapEditorCanvas = dynamic(
  () =>
    import("@/src/components/MapEditor/MapEditorCanvas").then(
      (mod) => mod.MapEditorCanvas
    ),
  {
    ssr: false,
    loading: () => <p className="text-gray-500">Loading canvas...</p>,
  }
);

export default function MapEditorPage() {
  const params = useParams();
  const mapId = params.mapId;
  const [mapName, setMapName] = useState("");

  // Undo/Redo states
  const [elements, setElements] = useState<MapElement[]>([]);
  const [history, setHistory] = useState<MapElement[][]>([[]]);
  const [historyPointer, setHistoryPointer] = useState(0);

  // Flag to prevent infinite loop when updating elements from history
  const isUpdatingFromHistory = useRef(false);

  // --- MULTI-SELECTION STATE ---
  const [selectedElements, setSelectedElements] = useState<MapElement[]>([]);

  // COPY/PASTE STATE
  const [copiedElement, setCopiedElement] = useState<MapElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<ElementType | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [multipleSeatsGridFields, setMultipleSeatsGridFields] = useState({
    rows: 7,
    cols: 7,
  });

  // Effect to manage history when elements state changes
  useEffect(() => {
    if (isUpdatingFromHistory.current) {
      isUpdatingFromHistory.current = false;
      return;
    }

    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyPointer + 1);
      newHistory.push(elements);
      return newHistory;
    });
    setHistoryPointer((prevPointer) => prevPointer + 1);
  }, [elements]);

  // Effect to load map data from Firestore
  useEffect(() => {
    const fetchMap = async () => {
      if (mapId === "new") {
        setMapName("New Map Draft");
        setElements([]);
        setHistory([[]]);
        setHistoryPointer(0);
        setIsMapLoading(false);
        return;
      }

      setIsMapLoading(true);
      setMapName(`Map Editor: ${mapId}`);
      try {
        const mapDocRef = doc(db, "maps", mapId as string);
        const mapDocSnap = await getDoc(mapDocRef);

        let loadedElements: MapElement[] = [];
        if (mapDocSnap.exists()) {
          const mapData = mapDocSnap.data();
          if (mapData && Array.isArray(mapData.elements)) {
            loadedElements = mapData.elements;
            console.log("Map loaded successfully:", loadedElements);
          } else {
            console.warn(
              "Map data found but 'elements' field is missing or not an array."
            );
          }
        } else {
          console.log("No such map document! Starting with an empty map.");
        }
        setElements(loadedElements);
        setHistory([loadedElements]);
        setHistoryPointer(0);
      } catch (error) {
        console.error("Error fetching map:", error);
        setElements([]);
        setHistory([[]]);
        setHistoryPointer(0);
      } finally {
        setIsMapLoading(false);
        setSelectedElements([]);
      }
    };

    fetchMap();
  }, [mapId]);

  useEffect(() => {
    const container = document.querySelector(".konvajs-content");
    if (container) {
      (container as HTMLElement).style.cursor = selectedTool
        ? "crosshair"
        : "default";
    }
  }, [selectedTool]);

  const canvasWidth = 1000;
  const canvasHeight = 700;
  const handleSelectElements = useCallback((els: MapElement[]) => {
    setSelectedElements(els);
  }, []);

  const addElementAtPosition = useCallback(
    (type: ElementType, position: { x: number; y: number }) => {
      const id = uuidv4();
      let newElement: MapElement | null = null;

      switch (type) {
        case "seat":
          newElement = {
            id: `seat-${id.substring(0, 4)}`,
            type: "seat",
            x: position.x - 15,
            y: position.y - 15,
            width: 30,
            height: 30,
            fill: "#4CAF50",
            text: "New Seat",
            fontSize: 14,
            draggable: true,
          };
          break;
        case "stage":
          newElement = {
            id: `stage-${id.substring(0, 4)}`,
            type: "stage",
            x: position.x - 100,
            y: position.y - 40,
            width: 200,
            height: 80,
            fill: "#607D8B",
            text: "New Stage",
            fontSize: 20,
            draggable: true,
          };
          break;
        case "text":
          newElement = {
            id: `text-${id.substring(0, 4)}`,
            type: "text",
            x: position.x - 50,
            y: position.y - 15,
            width: 100,
            height: 30,
            text: "New Text",
            fontSize: 18,
            fill: "black",
            draggable: true,
          };
          break;
        case "wall":
          newElement = {
            id: `wall-${id.substring(0, 4)}`,
            type: "wall",
            x: position.x - 100,
            y: position.y - 5,
            width: 200,
            height: 10,
            fill: "#795548",
            draggable: true,
            stroke: "#5D4037",
            strokeWidth: 2,
          };
          break;
        default:
          break;
      }

      if (newElement) {
        setElements((prev) => [...prev, newElement!]);
        handleSelectElements([newElement]);
      } else {
        setSelectedTool(null);
      }
    },
    [setElements, handleSelectElements]
  );

  const handleAddButtonClick = useCallback(
    (type: ElementType) => {
      setSelectedTool(type);
    },
    [setSelectedTool]
  );
  //handle multiple seats grid
  const onConfirmAddSeats = useCallback(
    (type: ElementType, rows: number, cols: number) => {
      setSelectedTool(type);
      setMultipleSeatsGridFields({
        rows: rows,
        cols: cols,
      });
    },
    []
  );
  // Update a single element (used by PropertiesPanel and keyboard shortcuts)
  const handleUpdateElement = useCallback((updatedElement: MapElement) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      )
    );
    setSelectedElements((prevSelected) =>
      prevSelected.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      )
    );
  }, []);

  // Delete a single element (used by PropertiesPanel and keyboard shortcuts)
  const handleDeleteElement = useCallback((elementId: string) => {
    setElements((prevElements) =>
      prevElements.filter((el) => el.id !== elementId)
    );
    setSelectedElements((prevSelected) =>
      prevSelected.filter((el) => el.id !== elementId)
    );
  }, []);

  const handleSaveMap = useCallback(async () => {
    setIsSaving(true);
    let currentMapId = mapId as string;

    if (mapId === "new") {
      currentMapId = uuidv4();
    }

    try {
      const mapDocRef = doc(db, "maps", currentMapId);
      await setDoc(mapDocRef, {
        elements: elements,
        lastModified: new Date().toISOString(),
      });
      console.log("Map saved successfully with ID:", currentMapId);
    } catch (error) {
      console.error("Error saving map:", error);
    } finally {
      setIsSaving(false);
    }
  }, [elements, mapId]);

  const handleUndo = useCallback(() => {
    if (historyPointer > 0) {
      isUpdatingFromHistory.current = true;
      setHistoryPointer((prev) => prev - 1);
      setElements(history[historyPointer - 1]);
      setSelectedElements([]); // Clear selection on undo
    }
  }, [history, historyPointer]);

  const handleRedo = useCallback(() => {
    if (historyPointer < history.length - 1) {
      isUpdatingFromHistory.current = true;
      setHistoryPointer((prev) => prev + 1);
      setElements(history[historyPointer + 1]);
      setSelectedElements([]); // Clear selection on redo
    }
  }, [history, historyPointer]);

  // --- GROUPING FUNCTIONS ---
  const handleGroupElements = useCallback(() => {
    if (selectedElements.length < 2) {
      alert("Select at least two elements to group.");
      return;
    }

    // Determine the bounding box for the new group
    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;

    selectedElements.forEach((el) => {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    });

    const newGroupId = `group-${uuidv4().substring(0, 4)}`;
    const newGroup: MapElement = {
      id: newGroupId,
      type: "group",
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,

      draggable: true,
      children: selectedElements.map((el) => ({
        ...el,
        // Children coordinates are relative to the group's top-left corner
        x: el.x - minX,
        y: el.y - minY,
      })),
    };

    // Remove grouped elements from the main elements array
    // Add the new group element
    setElements((prevElements) => {
      const remainingElements = prevElements.filter(
        (el) => !selectedElements.some((selEl) => selEl.id === el.id)
      );
      return [...remainingElements, newGroup];
    });

    setSelectedElements([newGroup]); // Select the new group
    console.log("Elements grouped:", newGroup.id);
  }, [selectedElements, setElements]);

  const handleUngroupElements = useCallback(() => {
    if (selectedElements.length !== 1 || selectedElements[0].type !== "group") {
      alert("Select a single group to ungroup.");
      return;
    }

    const groupToUngroup = selectedElements[0];
    const ungroupedChildren: MapElement[] =
      groupToUngroup.children?.map((child) => ({
        ...child,
        // Convert child coordinates back to absolute based on group's position
        x: child.x + groupToUngroup.x,
        y: child.y + groupToUngroup.y,
      })) || [];

    // Remove the group from elements array and add its children back
    setElements((prevElements) => {
      const remainingElements = prevElements.filter(
        (el) => el.id !== groupToUngroup.id
      );
      return [...remainingElements, ...ungroupedChildren];
    });

    setSelectedElements(ungroupedChildren); // Select the newly ungrouped elements
    console.log("Group ungrouped:", groupToUngroup.id);
  }, [selectedElements, setElements]);

  // KEYBOARD SHORTCUTS
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isInputField =
        (e.target as HTMLElement).tagName === "INPUT" ||
        (e.target as HTMLElement).tagName === "TEXTAREA";
      if (isInputField) {
        return;
      }

      // Arrow Key Movement - Apply to all selected elements
      if (
        selectedElements.length > 0 &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const moveAmount = 1;
        const newElements = elements.map((el) => {
          if (selectedElements.some((selEl) => selEl.id === el.id)) {
            let newX = el.x;
            let newY = el.y;
            switch (e.key) {
              case "ArrowUp":
                newY -= moveAmount;
                break;
              case "ArrowDown":
                newY += moveAmount;
                break;
              case "ArrowLeft":
                newX -= moveAmount;
                break;
              case "ArrowRight":
                newX += moveAmount;
                break;
            }
            return { ...el, x: newX, y: newY };
          }
          return el;
        });
        setElements(newElements);
        // Update selectedElements array with new positions
        setSelectedElements(
          newElements.filter((el) =>
            selectedElements.some((selEl) => selEl.id === el.id)
          )
        );
        return;
      }

      // Delete/Backspace
      if (["Delete", "Backspace"].includes(e.key)) {
        e.preventDefault();
        if (selectedElements.length > 0) {
          const selectedIdsToDelete = selectedElements.map((el) => el.id);
          setElements((prevElements) =>
            prevElements.filter((el) => !selectedIdsToDelete.includes(el.id))
          );
          setSelectedElements([]);
          console.log("Elements deleted:", selectedIdsToDelete);
        }
        return;
      }

      // Copy/Paste
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        if (selectedElements.length === 1) {
          // Only copy single element for now
          setCopiedElement(selectedElements[0]);
          console.log("Element copied:", selectedElements[0].id);
        } else if (selectedElements.length > 1) {
          // For multiple selected elements, copy the first one or implement multi-element copy
          alert(
            "Multi-element copy is not yet implemented. Copying only the first selected element."
          );
          setCopiedElement(selectedElements[0]);
        }
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        if (copiedElement) {
          const newId = `${copiedElement.type}-${uuidv4().substring(0, 4)}`;
          const pasteOffset = 10;
          const pastedElement: MapElement = {
            ...copiedElement,
            id: newId,
            x: copiedElement.x + pasteOffset,
            y: copiedElement.y + pasteOffset,
          };
          setElements((prevElements) => [...prevElements, pastedElement]);
          setSelectedElements([pastedElement]);
          console.log("Element pasted:", pastedElement.id);
        }
        e.preventDefault();
      }
    },
    [
      selectedElements,
      copiedElement,
      elements,
      setElements,
      handleDeleteElement,
      setSelectedElements,
    ]
  );
  const addSeatsGrid = useCallback(
    (
      position: { x: number; y: number },
      rows: number,
      cols: number,
      seatWidth: number,
      seatHeight: number,
      gap: number = 10
    ) => {
      const newSeats: MapElement[] = [];

      const totalGridWidth = cols * seatWidth + (cols - 1) * gap;
      const totalGridHeight = rows * seatHeight + (rows - 1) * gap;

      const startX = position.x - totalGridWidth / 2;
      const startY = position.y - totalGridHeight / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const id = `seat-${uuidv4().substring(0, 4)}-${row}-${col}`;
          newSeats.push({
            id,
            type: "seat",
            x: startX + col * (seatWidth + gap),
            y: startY + row * (seatHeight + gap),
            width: seatWidth,
            height: seatHeight,
            fill: "#4CAF50",
            text: `S${row + 1}-${col + 1}`,
            fontSize: 14,
            draggable: true,
          });
        }
      }

      setElements((prev) => [...prev, ...newSeats]);
      handleSelectElements(newSeats);
    },
    [setElements, handleSelectElements]
  );
  // Attach and detach keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (isMapLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-700">Loading map data...</p>
      </div>
    );
  }

  // Determine which element's properties to show in the panel
  // If multiple elements are selected, or a group is selected, show properties of the first one.
  const elementForPropertiesPanel =
    selectedElements.length === 1 ? selectedElements[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MapEditorHeader
        mapName={mapName}
        handleUndo={handleUndo}
        historyPointer={historyPointer}
        handleRedo={handleRedo}
        handleGroupElements={handleGroupElements}
        selectedElements={selectedElements}
        handleUngroupElements={handleUngroupElements}
        handleSaveMap={handleSaveMap}
        isSaving={isSaving}
        historyLength={history.length}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Tools */}
        <LeftPanelTools
          handleAddButtonClick={handleAddButtonClick}
          rows={multipleSeatsGridFields.rows}
          setRows={(value) =>
            setMultipleSeatsGridFields((prev) => ({ ...prev, rows: value }))
          }
          cols={multipleSeatsGridFields.cols}
          setCols={(value) =>
            setMultipleSeatsGridFields((prev) => ({ ...prev, cols: value }))
          }
          onConfirmAddSeats={onConfirmAddSeats}
        />

        {/* Main Work Area: Canvas */}
        <main className="flex-1 p-4 flex items-center justify-center bg-gray-200 overflow-auto">
          <DynamicMapEditorCanvas
            selectedTool={selectedTool}
            setSelectedTool={(tool) =>
              setSelectedTool(tool as ElementType | null)
            }
            addElementAtPosition={addElementAtPosition}
            width={canvasWidth}
            height={canvasHeight}
            elements={elements}
            setElements={setElements}
            selectedIds={selectedElements.map((el) => el.id)}
            onSelectElements={handleSelectElements}
            multipleSeatsGridFields={multipleSeatsGridFields}
            addSeatsGrid={addSeatsGrid}
          />
        </main>

        {/* Right Panel: Properties */}
        <aside className="w-64 bg-gray-100 p-4 border-l border-gray-200 flex-shrink-0">
          <PropertiesPanel
            selectedElement={elementForPropertiesPanel} // Pass the single selected element or null
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
          />
        </aside>
      </div>
    </div>
  );
}
