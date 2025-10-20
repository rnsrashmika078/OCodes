interface SplitterProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "horizontal" | "vertical" | "horizontalFlip";
  max?: number;
  min?: number;
  splitterId: number;
  setDragWidth: (data: {
    width: number;
    height: number;
    widthFlip: number;
    id: number;
  }) => void;
  dragWidth: {
    width: number;
    height: number;
    widthFlip: number;
    id: number;
  };
}

const Splitter = ({
  type = "vertical",
  splitterId,
  min = 58,
  max = 500,
  setDragWidth,
  dragWidth,
  ...props
}: SplitterProps) => {
  const hanldeDraggableElement = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startX = e.clientX;
    const startWidth = dragWidth.width;
    const startHeight = dragWidth.height;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;

      if (type === "horizontal") {
        let newWidth = startWidth + deltaX;
        if (newWidth >= min && newWidth <= max) {
          setDragWidth({ ...dragWidth, width: newWidth, id: splitterId });
        }
      } else if (type === "vertical") {
        let newHeight = startHeight + (startY - ev.clientY);
        if (newHeight >= min && newHeight <= max) {
          setDragWidth({
            ...dragWidth,
            height: newHeight,
            id: splitterId,
          });
        }
      } else if (type === "horizontalFlip") {
        const container = document.body.getBoundingClientRect(); // or parent container
        let newWidth = container.width - ev.clientX; // distance from right edge
        if (newWidth >= min && newWidth <= max) {
          setDragWidth({ ...dragWidth, widthFlip: newWidth, id: splitterId });
        }
      }

      document.body.style.cursor =
        type === "vertical" ? "ns-resize" : "ew-resize";
    };

    const handleMouseUp = () => {
      document.body.style.removeProperty("cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const splitterType = {
    vertical: "absolute  -translate-y-1/2 border cursor-ns-resize w-full",
    horizontal:
      "absolute  top-1/2 right-0  -translate-y-1/2 h-full border  cursor-ew-resize",
    horizontalFlip:
      "absolute  top-1/2 left-0  -translate-y-1/2 h-full border  cursor-ew-resize",
  };

  return (
    <div
      {...props}
      className={splitterType[type]}
      onMouseDown={(e) =>
        dragWidth.id === splitterId ? hanldeDraggableElement(e) : null
      }
    />
  );
};

export default Splitter;
