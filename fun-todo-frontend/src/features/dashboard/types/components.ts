import { ClientData, SensorValue, SortOption, ViewMode } from "./dashboard";

export interface SensorBoxProps {
  /** The unique identifier for the sensor */
  sensorId: string;
  /** The current values of the sensor */
  values: SensorValue[];
}

export interface SensorBarChartProps {
  /** The client data containing sensor information */
  client: ClientData;
}

export interface SensorTableProps {
  /** The client data containing sensor information */
  client: ClientData;
}

export interface CombinedSensorTableProps {
  /** Array of client data containing sensor information */
  clients: ClientData[];
}

export interface ViewControlsProps {
  /** The current view mode */
  viewMode: ViewMode;
  /** Callback function when view mode changes */
  onViewChange: (
    event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null
  ) => void;
}

export interface ClientBoxProps {
  /** The client data containing sensor information */
  client: ClientData;
  /** The width of the container in pixels */
  containerWidth: number;
  /** The current sort option for this client's sensors */
  sortOption: string;
  /** The current view mode */
  viewMode: string;
  /** Callback function when sort option changes */
  onSortChange: (clientId: string, sortOption: SortOption) => void;
  /** Ref callback for the container element */
  containerRef: React.RefObject<HTMLDivElement>;
}

export type DashboardProps = unknown;
