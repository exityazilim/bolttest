export interface PagePermission {
  pageId: string;
  pageName?: string;
  me: boolean;
  view: boolean;
  update: boolean;
  insert: boolean;
  delete: boolean;
}

export interface Role {
  id?: string;
  name: string;
  detail: string;
  pageList: PagePermission[];
}