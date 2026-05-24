export default function Loading() {
  return (
    <div id="app-loading-screen" aria-label="Loading application" role="status" aria-live="polite">
      <div id="app-loading-content">
        <div id="app-loading-spinner" />
        <div id="app-loading-copy">Welcome to the Family 🦚</div>
      </div>
    </div>
  );
}
