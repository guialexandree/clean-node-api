export interface HashComparer {
  compare: (value: string, hashed: string) => Promise<boolean>
}
