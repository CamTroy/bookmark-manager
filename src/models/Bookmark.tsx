export interface Bookmark {
    id: string;
    name: string;
    uri: string;
    tags: string[] | null;
    description: string | null;
}
