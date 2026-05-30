import { useState } from "react";
import FileItem from "./FileItem";

export interface IFile {
  id: number;
  title: string;
  type: "Folder" | "File";
  children?: IFile[];
}

const INIT_DATA: IFile = {
  id: 1,
  title: "root",
  type: "Folder",
  children: [
    {
      id: 2,
      title: "public",
      type: "Folder",
      children: [
        {
          id: 5,
          title: "index.html",
          type: "File",
        },
      ],
    },
    {
      id: 3,
      title: "src",
      type: "Folder",
      children: [
        {
          id: 6,
          title: "index.jsx",
          type: "File",
        },
        {
          id: 7,
          title: "main.jsx",
          type: "File",
        },
      ],
    },
    {
      id: 4,
      title: "package.json",
      type: "File",
    },
  ],
};

const FileExplorer = () => {
  const [fileData, setFileData] = useState<IFile>(INIT_DATA);

  const handleItemAdd = (
    data: IFile,
    folderId: number,
    query: string,
    type: "Folder" | "File"
  ): IFile => {
    if (data?.id === folderId) {
      return {
        ...data,
        children: [
          ...(data?.children || []),
          {
            id: Date.now(),
            title: query,
            type: type,
          },
        ],
      };
    } else {
      return {
        ...data,
        children: data?.children?.map((item) =>
          handleItemAdd(item, folderId, query, type)
        ),
      };
    }
  };

  const handleDelete = (data: IFile, folderId: number) => {
    return {
      ...data,
      children: data?.children
        ?.filter((item) => item?.id !== folderId)
        ?.map((item): any => handleDelete(item, folderId)),
    };
  };

  const handleEdit = (data: IFile, folderId: number, query: string) => {
    if (data?.id === folderId) {
      return { ...data, title: query };
    } else {
      return {
        ...data,
        children: data?.children?.map(
          (item): IFile => handleEdit(item, folderId, query)
        ),
      };
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FileItem
        key={fileData?.id}
        data={fileData}
        onAdd={(
          folderId: number,
          query: string,
          type: "Folder" | "File"
        ): any => {
          setFileData((prev) => handleItemAdd(prev, folderId, query, type));
        }}
        onDelete={(folderId: number): any => {
          setFileData((prev): any => handleDelete(prev, folderId));
        }}
        onEdit={(folderId: number, query: string): any => {
          setFileData((prev): any => handleEdit(prev, folderId, query));
        }}
      />
    </div>
  );
};

export default FileExplorer;
