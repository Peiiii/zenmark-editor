
export interface FSItemInformation {
    name: string;
    path: string;
    type: "file" | "directory";
    size: number;
    modified: number;
    created: number;
  }
  
  export interface FileInformation extends FSItemInformation {
    content: string;
  }
  
  export interface DirectoryInformation extends FSItemInformation {
    content: FSItemInformation[];
  }
  
  interface OperationParams {
    path: string;
  }
  
  interface RenameFileParams extends OperationParams {
    newName: string;
  }
  
  interface RenameDirectoryParams extends OperationParams {
    newName: string;
  }
  
  export type RemoteFS = {
    readDirectory(params: OperationParams): Promise<DirectoryInformation>;
  
    createFile(params: OperationParams): Promise<void>;
  
    createDirectory(params: OperationParams): Promise<void>;
  
    deleteFile(params: OperationParams): Promise<void>;
  
    deleteDirectory(params: OperationParams): Promise<void>;
  
    renameFile(params: RenameFileParams): Promise<void>;
  
    renameDirectory(params: RenameDirectoryParams): Promise<void>;
  
    readFile(params: OperationParams): Promise<FileInformation>;
  
    writeFile(params: OperationParams & { content: string }): Promise<void>;
  };