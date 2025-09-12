interface SplitterProps {
  type?: "horizontal" | "vertical";
  max?: number;
  min?: number;
  setDragWidth: (width: number) => void;
}
const Splitter = ({
  type = "vertical",
  min = 58,
  max = 500,
  setDragWidth,
}: SplitterProps) => {
  const hanldeDraggableElement = () => {
    const handleMouseMove = (e: MouseEvent) => {
      const val = type === "horizontal" ? e.clientY : e.clientX;
      if (!(val <= min || val >= max)) {
        setDragWidth(val);
      }
      document.body.style.cursor = "ew-resize";
    };

    const handleMouseUp = () => {
      document.body.style.removeProperty("cursor");
      window.removeEventListener("mousemove", handleMouseMove); // mouse click and drag
      window.removeEventListener("mouseup", handleMouseUp); //mouse click release
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  return (
    <div
      className={`absolute p-[1px]  top-1/2 right-0  transition-all -translate-y-1/2 h-full bg-blue-900 cursor-ew-resize`}
      onMouseDown={hanldeDraggableElement}
    ></div>
  );
};

export default Splitter;
