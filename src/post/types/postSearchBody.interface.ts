

export interface PostSearchBody {
  id: number,
  title: string,
  content: string,
  authorId: number
}
export interface UpdatePostSearchBody {
  title?: string,
  content?: string,
}