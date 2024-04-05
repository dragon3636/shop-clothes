

export interface PostSearchBody {
  id: number,
  title: string,
  paragraphs: string[],
  authorId: number
}
export interface UpdatePostSearchBody {
  title?: string,
  paragraphs?: string[],
}