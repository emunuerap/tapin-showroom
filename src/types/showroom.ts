export type ViewMode = 'guests' | 'venues';

export interface ShowroomProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
}
