export class Cache {
  public static instance: Cache
  public cache: { [key: string]: any } = {}

  constructor() {
    if (!Cache.instance) {
      Cache.instance = this
    }
  }

  save(key: string, data: any) {
    this.cache[key] = data
  }

  get(key: string) {
    return this.cache[key]
  }
}
