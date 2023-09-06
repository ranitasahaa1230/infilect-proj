import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Stage, Layer, Rect } from "react-konva";
import Image1 from "./assets/Image1.jpg";
import Image2 from "./assets/Image2.jpg";
import Image3 from "./assets/Image3.jpg";
import Image4 from "./assets/Image4.jpg";

function App() {
  const [images, setImages] = useState([Image1, Image2, Image3, Image4]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rectangles, setRectangles] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [annotationData, setAnnotationData] = useState({});

  // Function to navigate to the previous image
  const handlePrevImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  // Function to navigate to the next image
  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    setDrawing(true);
    setRectangles([
      ...rectangles,
      {
        x1: x,
        y1: y,
        x2: x,
        y2: y,
      },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    const updatedRectangles = [...rectangles];
    updatedRectangles[rectangles.length - 1].x2 = x;
    updatedRectangles[rectangles.length - 1].y2 = y;
    setRectangles(updatedRectangles);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const saveAnnotations = () => {
    const imageId = images[activeImageIndex];
    const annotation = rectangles.map((rect) => ({
      x1: rect.x1,
      y1: rect.y1,
      x2: rect.x2,
      y2: rect.y2,
    }));

    const updatedAnnotationData = {
      ...annotationData,
      [imageId]: annotation,
    };

    setAnnotationData(updatedAnnotationData);
    setRectangles([]); // Clear the rectangles after saving.
    toast.success("Antations saved successfully", {
      position: "bottom-right",
      autoClose: 5000,
    });
  };

  const downloadAnnotations = () => {
    const annotationJson = JSON.stringify(annotationData);
    const blob = new Blob([annotationJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "annotations.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Antations dowloaded successfully", {
      position: "bottom-right",
      autoClose: 5000,
    });
  };

  return (
    <div className="bg-red-200">
      <div className="flex justify-center items-center pt-10 pb-6">
        <button
          onClick={() => handlePrevImage()}
          disabled={activeImageIndex===0}
          className="mr-4 rounded-lg shadow-sm bg-blue-500 py-2 px-3 text-white"
        >
          Previous
        </button>
        <button
          onClick={() => handleNextImage()}
          disabled={activeImageIndex===images.length-1}
          className="mr-4 rounded-lg shadow-sm bg-blue-500 py-2 px-3 text-white"
        >
          Next
        </button>
        <button
          onClick={saveAnnotations}
          className="mr-4 rounded-lg shadow-sm bg-blue-500 py-2 px-3 text-white"
        >
          Save
        </button>
        <button
          onClick={downloadAnnotations}
          className="mr-4 rounded-lg shadow-sm bg-blue-500 py-2 px-3 text-white"
        >
          Download
        </button>
      </div>

      <div className="w-1/2 h-36 m-auto">
        <img
          src={images[activeImageIndex]}
          alt={`Image ${activeImageIndex + 1}`}
        />
      </div>
      <div className="annotation-container">
        <Stage
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {rectangles.map((rect, index) => (
              <Rect
                key={index}
                x={Math.min(rect.x1, rect.x2)}
                y={Math.min(rect.y1, rect.y2)}
                width={Math.abs(rect.x2 - rect.x1)}
                height={Math.abs(rect.y2 - rect.y1)}
                stroke="red"
                strokeWidth={2}
                draggable
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
export default App;
