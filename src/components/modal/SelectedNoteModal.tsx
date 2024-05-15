"use client"
import { useStateUseSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';

interface SelectedText {
    text: string;
    cfi: string;
}

interface SelectedNoteModalProps {
    selectedTexts: SelectedText[];
    handleTextClick: (cfi: string) => void;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    bookId: string;
}

interface Note {
    cfi: string;
    comment: string;
    createdAt: string;
    highlightColor: string;
    page?: number;
    position: number;
    _id: string;
}

const SelectedNoteModal: React.FC<SelectedNoteModalProps> = ({ selectedTexts, handleTextClick, setShowModal, bookId }) => {
    const user = useStateUseSelector((state: RootState) => state.auth.user);
    const bearerToken = user?.authentication.accessToken;
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const fetchSelectedNotes = async () => {
            try {
                const response = await fetch(`http://devapis.booksnai.net/api/books/${bookId}/notes`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${bearerToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch selected notes: ${response.statusText}`);
                }

                const responseData = await response.json();
                setNotes(responseData);
            } catch (error) {
                console.error("Error fetching selected notes:", error);
                // Handle error: You might want to display an error message to the user
            }
        };

        fetchSelectedNotes();
    }, [bearerToken, bookId]);

    const handleDeleteNote = async (noteId: string) => {
        try {
            const response = await fetch(`http://devapis.booksnai.net/api/books/${bookId}/notes/${noteId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${bearerToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete selected note: ${response.statusText}`);
            }

            // Remove the deleted note from the notes state
            setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
        } catch (error) {
            console.error("Error deleting selected note:", error);
            // Handle error: You might want to display an error message to the user
        }
    }

    return (
        <>
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-6 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                    <div
                        className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        {notes.length > 0 ? (
                            <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4 flex gap-1 flex-col">
                                {notes.map((selected, index) => (
                                    <div key={index} className="flex justify-between items-center gap-2">
                                        <p className="text-sm text-gray-500">
                                            {selected.comment}
                                        </p>
                                        <div className='flex justify-between gap-2'>
                                            <button
                                                onClick={() => handleTextClick(selected.cfi)}
                                                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none"
                                            >
                                                Go To
                                            </button>
                                            <button onClick={() => handleDeleteNote(selected._id)}>
                                                x
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <h1 className='px-6 pt-5 pb-4 sm:p-6 sm:pb-4'>Loading...</h1>
                        )}

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SelectedNoteModal;
