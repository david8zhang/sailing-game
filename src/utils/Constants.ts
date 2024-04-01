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

export enum ColliderLabels {
  PLAYER_COLLIDER_LABEL = 'PLAYER_COLLIDER_LABEL',
  PLAYER_CANNONBALL = 'PLAYER_CANNONBALL',
  ENEMY_CANNONBALL = 'ENEMY_CANNONBALL',
  ENEMY_SENSOR_LABEL = 'ENEMY_SENSOR_LABEL',
  ENEMY_MAIN_COLLIDER = 'ENEMY_MAIN_COLLIDER',
  LAND_TILES = 'LAND_TILES',
  MAP_BOUNDS = 'MAP_BOUNDS',
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
  public static CANNONBALL_SPEED_MULTIPLIER = 10
  public static ENEMY_CANNONBALL_SPEED_MULTIPLIER = 8

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
