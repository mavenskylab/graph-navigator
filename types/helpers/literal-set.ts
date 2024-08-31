export type LiteralsFromSet<T extends Set<any>> =
  T extends Set<infer U> ? U : never
