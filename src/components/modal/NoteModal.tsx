import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  addNote: AddNote | null;
  setAddNotes: (addNotes: AddNote | null) => void;
  setHightLightColor: (color: string) => void;
  bearerToken: string | undefined;
  position?: PositionProp;
}

const NoteModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  setAddNotes,
  addNote,
  bookId,
  bearerToken,
  setHightLightColor,
  position
}) => {
  // console.log(addNote, "inside Modal");

  const [note, setNote] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#ff0000");
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };
  const handleSave = async () => {
    // Send POST request to add the selected text to the API
    const response = await fetch(
      `http://devapis.booksnai.net/api/books/${bookId}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          page: addNote?.page,
          cfi: addNote?.cfi,
          comment: note,
          highlightColor: selectedColor,
          selectedText: addNote?.selectedText,
        }),
      }
    );

    console.log("Note added successfully:", response);
    if (response.status === 200) {
      setHightLightColor(selectedColor);

      setNote(""); // Clear note after saving
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
        id="noteModal"
          className="absolute z-999"
          style={{
            left:`${position?.left}px`,
            top:`${position?.top}px`
          }}
        >
          <div className="bg-white p-8 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Enter your note</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Type your note here..."
              />
            </div>
            <div className="flex justify-between mb-4">
             
              <div className="flex">
                {addNote && (
                  <button
                    className={`w-6 h-6 rounded-full border border-gray-300 mr-2 focus:outline-none ${
                      selectedColor === addNote.highlightColor
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    style={{ backgroundColor: addNote.highlightColor }}
                    onClick={() => handleColorSelect(addNote.highlightColor)}
                  />
                )}

                <button
                  className={`w-6 h-6 rounded-full border border-gray-300 mr-2 focus:outline-none ${
                    selectedColor === "#ff0000" ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ backgroundColor: "#ff0000" }}
                  onClick={() => handleColorSelect("#ff0000")}
                />
                <button
                  className={`w-6 h-6 rounded-full border border-gray-300 mr-2 focus:outline-none ${
                    selectedColor === "#00ff00" ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ backgroundColor: "#00ff00" }}
                  onClick={() => handleColorSelect("#00ff00")}
                />
                <button
                  className={`w-6 h-6 rounded-full border border-gray-300 mr-2 focus:outline-none ${
                    selectedColor === "#0000ff" ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{ backgroundColor: "#0000ff" }}
                  onClick={() => handleColorSelect("#0000ff")}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <div className="bg-black text-white absolute "  style={{
                        left: `408px`, // Position modal at the end of the selected text
                        top: `141px` // Align top of modal with top of selected text
                    }}>
        <button>Add note</button>
      </div> */}
    </>
  );
};

export default NoteModal;
