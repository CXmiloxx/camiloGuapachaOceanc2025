export interface WeatherData {
  sol: string;
  temp_min: number | null;
  temp_max: number | null;
  wind_min: number | null;
  wind_max: number | null;
  wind_avg: number | null;

  pressure_min: number | null;
  pressure_max: number | null;
  pressure_avg: number | null;

  firstUTC: number | null;
  lastUTC: number | null;

  season: string | null;
  month_ordinal: number | null;
  northern_season: string | null;
  southern_season: string | null;
}
