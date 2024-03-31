export enum EventTypes {
  UI_CREATED,
}

export interface Event {
  type: EventTypes
  data?: any
}

export class EventBus {
  public static instance: EventBus
  public observers: Function[] = []

  constructor() {
    if (!EventBus.instance) {
      EventBus.instance = this
    }
  }

  public publishEvent(event: Event) {
    this.observers.forEach((fn) => {
      fn(event)
    })
  }

  public subscribe(fn: Function) {
    this.observers.push(fn)
  }

  public unsubscribe(fn: Function) {
    this.observers = this.observers.filter((o) => o !== fn)
  }
}
