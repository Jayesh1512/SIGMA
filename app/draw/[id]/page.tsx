"use client"

import type { fabric } from "fabric"
import { useEffect, useRef, useState } from "react"
import { Live } from "@/components/live"
import { Navbar } from "@/components/navbar"
import { RightSidebar } from "@/components/right-sidebar"
import { defaultNavElement } from "@/constants"
import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas"
import { handleDelete, handleKeyDown } from "@/lib/key-events"
import { handleImageUpload } from "@/lib/shapes"
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config"
import type { ActiveElement, Attributes, HistoryEntry } from "@/types/type"
import { HistoryPanel } from "@/components/history-panel"
import { HistoryButton } from "@/components/history-button"

export default function Editor({ params }: { params: { id: string } }) {
  const { id } = params

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const shapeRef = useRef<fabric.Object | null>(null)
  const selectedShapeRef = useRef<string | null>(null)
  const activeObjectRef = useRef<fabric.Object | null>(null)
  const isDrawing = useRef(false)
  const isEditingRef = useRef(false)
  
  // Add timeout reference for debouncing
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Add pending history entry ref
  const pendingHistoryEntryRef = useRef<{action: string, objectId?: string, details?: any} | null>(null)

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  })
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  })

  // History state to track canvas changes
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false)

  const undo = useUndo()
  const redo = useRedo()
  const canvasObjects = useStorage((root) => root.canvasObjects)

  // Modified function to add a new entry to the history with debouncing
  const addHistoryEntry = (action: string, objectId?: string, details?: any) => {
    // Store the current entry as pending
    pendingHistoryEntryRef.current = { action, objectId, details }
    
    // Clear any existing timeout
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current)
    }
    
    // Set a new timeout to add the history entry after 1 second
    historyTimeoutRef.current = setTimeout(() => {
      if (!pendingHistoryEntryRef.current) return
      
      const { action, objectId, details } = pendingHistoryEntryRef.current
      
      // Capture the current canvas state if fabricRef is available
      const canvasState = fabricRef.current ? fabricRef.current.toJSON() : undefined

      const newEntry: HistoryEntry = {
        timestamp: new Date().toISOString(),
        action,
        objectId,
        details,
        userId: "current-user", // Replace with actual user ID from your auth system
        canvasState, // Save the canvas state with each history entry
      }

      setHistory((prevHistory) => [...prevHistory, newEntry])

      // Persist history to storage
      saveHistoryToStorage(newEntry)
      
      // Clear the pending entry
      pendingHistoryEntryRef.current = null
    }, 1000) // 1 second debounce
  }

  // Function to save history to Liveblocks storage
  const saveHistoryToStorage = useMutation(({ storage }, entry) => {
    if (!entry) return

    const historyEntries = storage.get("historyEntries" as any) || []
    historyEntries.push(entry)
    (storage as any).set("historyEntries", historyEntries);
  }, [])

  const restoreCanvasState = (entry: HistoryEntry) => {
    if (!fabricRef.current || !entry.canvasState) return

    // Clear the current canvas
    fabricRef.current.clear()

    // Load the saved state
    fabricRef.current.loadFromJSON(entry.canvasState, () => {
      fabricRef.current?.renderAll()

      // Add a history entry for the restoration
      addHistoryEntry("state_restored", undefined, {
        fromTimestamp: entry.timestamp,
      })
    })
  }

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef })

    // Add initial history entry when canvas is created
    addHistoryEntry("canvas_initialized")

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      })
    })

    canvas.on("mouse:move", (options) => {
      handleCanvasMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
      })
    })

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef,
      })

      // Add history entry when a shape is created
      if (shapeRef.current) {
        addHistoryEntry("shape_created", shapeRef.current.data?.objectId, {
          type: selectedShapeRef.current,
        })
      }
    })

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      })

      // Add history entry when an object is modified
      if (options.target) {
        addHistoryEntry("object_modified", options.target.data?.objectId, {
          type: options.target.type,
          action: "modified",
        })
      }
    })

    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      })

      // Add history entry when selection is created
      if (options.selected) {
        const selectedIds = options.selected.map((obj: any) => obj.data?.objectId)
        addHistoryEntry("selection_created", undefined, { selectedIds })
      }
    })

    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      })
    })

    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      })

      // Add history entry when a path is created
      if ((options as any).path) {
addHistoryEntry("path_created", (options as any).path?.data?.objectId);
      }
    })

    window.addEventListener("resize", () => {
      handleResize({ canvas })
    })

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })

      // Add history entry for undo/redo actions
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        addHistoryEntry("undo_performed")
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) {
        addHistoryEntry("redo_performed")
      }
    })

    return () => {
      canvas.dispose()
      window.removeEventListener("resize", () => handleResize({ canvas: null }))
      // Clear any pending timeout when unmounting
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current)
      }
    }
  }, [canvasRef, undo, redo])

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    })
  }, [canvasObjects])

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return

    const { objectId } = object
    const shapeData = object.toJSON()
    shapeData.objectId = objectId

    const canvasObjects = storage.get("canvasObjects")
    
    // Add safety check to ensure canvasObjects exists and has a set method
    if (!canvasObjects || typeof canvasObjects.set !== 'function') {
      console.error("canvasObjects is not properly initialized or doesn't have a set method")
      return
    }
    
    canvasObjects.set(objectId, shapeData)

    // Add history entry when a shape is synced to storage
    addHistoryEntry("shape_synced", objectId, {
      type: object.type,
    })
  }, [])

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects")
    if (!canvasObjects || canvasObjects.size === 0) return true

    // Add history entry before deleting all shapes
    addHistoryEntry("all_shapes_deleted", undefined, {
      count: canvasObjects.size,
    })

    for (const [key] of canvasObjects.entries()) {
      canvasObjects.delete(key)
    }
    return canvasObjects.size === 0
  }, [])

  const deleteShapeFromStorage = useMutation(({ storage }, objectId) => {
    const canvasObjects = storage.get("canvasObjects")

    // Add history entry before deleting a shape
    addHistoryEntry("shape_deleted", objectId)

    canvasObjects.delete(objectId)
  }, [])

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem)

    // Add history entry when active element changes
    addHistoryEntry("active_element_changed", undefined, {
      from: activeElement.value,
      to: elem.value,
    })

    switch (elem.value) {
      case "reset":
        deleteAllShapes()
        fabricRef.current?.clear()
        setActiveElement(defaultNavElement)
        break
      case "delete":
        handleDelete(fabricRef.current!, deleteShapeFromStorage)
        setActiveElement(defaultNavElement)
        break
      case "image":
        imageInputRef.current?.click()
        isDrawing.current = false
        fabricRef.current!.isDrawingMode = false
        break
    }

    selectedShapeRef.current = elem.value
  }

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e) => {
          if (!fabricRef.current || !e.target.files) return
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef,
            shapeRef,
            syncShapeInStorage,
          })

          // Add history entry when an image is uploaded
          addHistoryEntry("image_uploaded", undefined, {
            filename: e.target.files[0].name,
          })
        }}
      />
      <section className="flex h-full flex-row">
        {/* <LeftSidebar allShapes={Array.from(canvasObjects)} /> */}
        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
        <Live canvasRef={canvasRef} undo={undo} redo={redo} />

        {/* Add the HistoryButton in a fixed position */}
        <div className="absolute top-3 right-3 bg-black text-white z-10">
          <HistoryButton history={history} onToggleHistoryPanel={() => setIsHistoryPanelOpen(!isHistoryPanelOpen)} />
        </div>
      </section>

      {/* Conditionally render the HistoryPanel */}
      {isHistoryPanelOpen && (
        <HistoryPanel
          history={history}
          onClose={() => setIsHistoryPanelOpen(false)}
          onRestoreState={restoreCanvasState}
        />
      )}
    </main>
  )
}