import { ChangeEvent, FormEvent, useState } from "react";
import { IFile } from "./FileExplorer";

interface IFileItem {
  data: IFile;
  onAdd: (folderId: number, query: string, type: "Folder" | "File") => IFile;
  onDelete: (folderId: number) => IFile;
  onEdit: (folderId: number, query: string) => IFile;
}
const FileItem = ({ data, onAdd, onDelete, onEdit }: IFileItem) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [itemType, setItemType] = useState<"Folder" | "File">("File");
  const [itemId, setItemID] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleToggleChildren = () => {
    setShowChildren(!showChildren);
  };

  const handleAddFile = (folderId: number) => {
    setItemType("File");
    setItemID(folderId);
    setShowChildren(true);
  };
  const handleAddFolder = (folderId: number) => {
    setItemType("Folder");
    setItemID(folderId);
    setShowChildren(true);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (itemId) {
      if (isEdit) {
        onEdit(itemId, query);
      } else {
        onAdd(itemId, query, itemType);
      }
      setIsEdit(false);
      setItemID(null);
      setQuery("");
    }
  };

  const handleEdit = (data: IFile) => {
    setIsEdit(true);
    setItemID(data?.id);
    setQuery(data?.title);
  };

  return (
    <div className="flex pl-3 flex-col justify-center gap-4 border-l border-gray-400">
      <div className="flex gap-4 items-center">
        <span className="cursor-pointer text-sm" onClick={handleToggleChildren}>
          {`${data?.type === "Folder" ? "📁 " : "🗳️ "}` + data?.title}
        </span>
        {data?.type !== "File" && (
          <button
            className="text-xs py-1 px-3  rounded-md bg-blue-100"
            onClick={() => handleAddFile(data?.id)}
          >
            Add file
          </button>
        )}
        {data?.type !== "File" && (
          <button
            className="text-xs py-1 px-3  rounded-md bg-green-100"
            onClick={() => handleAddFolder(data?.id)}
          >
            Add folder
          </button>
        )}
        {itemId && (
          <form action="" onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              autoFocus
              required
              placeholder="Add new item name...."
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              className="border"
            />
            <button>✅</button>
            <button
              type="button"
              onClick={() => {
                setItemID(null);
                setQuery("");
              }}
            >
              ❌
            </button>
          </form>
        )}
        <button
          className="text-xs py-1 px-3  rounded-md bg-orange-200"
          onClick={() => handleEdit(data)}
        >
          Edit
        </button>
        <button
          className="text-xs py-1 px-3  rounded-md bg-red-100"
          onClick={() => onDelete(data?.id)}
        >
          Delete
        </button>
      </div>
      {showChildren && data?.children && data?.children?.length > 0 && (
        <div className="flex flex-col gap-4">
          {data?.children?.map((item) => {
            return (
              <FileItem
                data={item}
                onAdd={onAdd}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileItem;
