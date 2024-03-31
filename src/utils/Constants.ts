export enum WindDirection {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST',
  NORTHEAST = 'NORTHEAST',
  NORTHWEST = 'NORTHWEST',
  SOUTHEAST = 'SOUTHEAST',
  SOUTHWEST = 'SOUTHWEST',
}

export class Constants {
  public static WINDOW_WIDTH = 800
  public static WINDOW_HEIGHT = 600
  public static GAME_HEIGHT = 3200
  public static GAME_WIDTH = 3200
  public static CELL_SIZE = 64

  public static SLOW_SPEED = 1
  public static MEDIUM_SPEED = 2
  public static FAST_SPEED = 3

  private static WIND_DIRECTION_TO_ANGLE = {
    [WindDirection.NORTH]: 270,
    [WindDirection.SOUTH]: 90,
    [WindDirection.EAST]: 0,
    [WindDirection.WEST]: 180,
    [WindDirection.NORTHEAST]: 315,
    [WindDirection.NORTHWEST]: 225,
    [WindDirection.SOUTHEAST]: 45,
    [WindDirection.SOUTHWEST]: 135,
  }

  public static getAngleForWindDirection(windDirection: WindDirection): number {
    return this.WIND_DIRECTION_TO_ANGLE[windDirection]
  }
}
