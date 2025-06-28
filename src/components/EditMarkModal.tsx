import { useState, useEffect } from "react";
import {
  MdClose,
  MdEdit,
  MdSave,
  MdCancel,
  MdPerson,
  MdSchool,
  MdSubject,
  MdAssignment,
  MdGrade,
  MdNumbers,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkCircle, IoWarningOutline } from "react-icons/io5";
import type { Mark } from "../types/mark.types";

interface EditMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  mark: Mark | null;
  onMarkUpdate: (id: string, newMark: number) => Promise<void>;
  isUpdating: boolean;
}

const EditMarkModal = ({
  isOpen,
  onClose,
  mark,
  onMarkUpdate,
  isUpdating,
}: EditMarkModalProps) => {
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (mark) {
      setEditValue(mark.mark.toString());
      setError("");
      setSuccess(false);
      setIsEditing(false);
    }
  }, [mark]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setIsEditing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!isOpen || !mark) return null;

  const handleEditStart = () => {
    setIsEditing(true);
    setError("");
    setSuccess(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(mark.mark.toString());
    setError("");
  };

  const handleEditSave = async () => {
    const newMark = parseFloat(editValue);
    const maxMark = Number(mark.maxmark);

    // Validation
    if (isNaN(newMark)) {
      setError("Please enter a valid number");
      return;
    }

    if (newMark < 0) {
      setError("Mark cannot be negative");
      return;
    }

    if (newMark > maxMark) {
      setError(`Mark cannot exceed maximum mark of ${maxMark}`);
      return;
    }

    try {
      setError("");
      await onMarkUpdate(mark.slno, newMark);
      setSuccess(true);
      // Update the mark object for display
      mark.mark = newMark;
    } catch (error) {
      console.error("Failed to update mark:", error);
      setError("Failed to update mark. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isUpdating) {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MdPerson className="text-blue-600" />
            Student Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-full transition-colors duration-200"
            disabled={isUpdating}
          >
            <MdClose className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Student Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                <MdPerson className="text-blue-600 text-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Student</p>
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {mark.student_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                <MdNumbers className="text-green-600 text-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Admission No</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {mark.admission}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                  <MdSchool className="text-purple-600 text-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Class</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {mark.class_field}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                  <MdSchool className="text-purple-600 text-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Division</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {mark.division}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                <MdSubject className="text-orange-600 text-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Subject</p>
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {mark.subject_name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                  <MdAssignment className="text-indigo-600 text-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Term</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {mark.term}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                  <MdAssignment className="text-indigo-600 text-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Part</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {mark.part}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-gray-50/80 rounded-lg">
                <MdAssignment className="text-teal-600 text-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600">Assessment</p>
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {mark.assessmentitem_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Mark Editing */}
            <div className="bg-blue-50/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                  <MdGrade className="text-blue-600" />
                  Mark Details
                </h4>
                {!isEditing && !success && (
                  <button
                    onClick={handleEditStart}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 text-xs"
                  >
                    <MdEdit className="h-3 w-3" />
                    Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Current Mark</p>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full px-2 py-1 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-semibold"
                        autoFocus
                        min="0"
                        max={mark.maxmark}
                        step="0.1"
                        disabled={isUpdating}
                      />
                      {isUpdating && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <AiOutlineLoading3Quarters className="h-3 w-3 animate-spin text-blue-600" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-blue-600 flex items-center gap-2">
                      {mark.mark}
                      {success && (
                        <IoCheckmarkCircle className="h-4 w-4 text-green-500" />
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Maximum Mark</p>
                  <p className="text-xl font-bold text-gray-700">
                    {mark.maxmark}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1">Grade</p>
                <p className="text-lg font-semibold text-gray-900">
                  {mark.grade}
                </p>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={handleEditSave}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 flex-1 text-xs"
                  >
                    {isUpdating ? (
                      <AiOutlineLoading3Quarters className="h-3 w-3 animate-spin" />
                    ) : (
                      <MdSave className="h-3 w-3" />
                    )}
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleEditCancel}
                    disabled={isUpdating}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 flex-1 text-xs"
                  >
                    <MdCancel className="h-3 w-3" />
                    Cancel
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-2 bg-red-50/80 border border-red-200 rounded-lg flex items-center gap-2">
                  <IoWarningOutline className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-2 bg-green-50/80 border border-green-200 rounded-lg flex items-center gap-2">
                  <IoCheckmarkCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <p className="text-green-700 text-xs">
                    Mark updated successfully!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMarkModal;
