import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "./search-store";

describe("Search Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useSearchStore.setState({
      query: "",
      isSearching: false,
      progress: {
        stage: "identifying",
        percentage: 0,
        message: "",
      },
      error: null,
    });
  });

  describe("setQuery", () => {
    it("sets the search query", () => {
      const store = useSearchStore.getState();
      store.setQuery("iPhone 15");

      expect(useSearchStore.getState().query).toBe("iPhone 15");
    });
  });

  describe("startSearch", () => {
    it("sets isSearching to true", () => {
      const store = useSearchStore.getState();
      store.startSearch();

      const state = useSearchStore.getState();
      expect(state.isSearching).toBe(true);
    });

    it("clears previous error", () => {
      useSearchStore.setState({ error: "Previous error" });
      const store = useSearchStore.getState();
      store.startSearch();

      expect(useSearchStore.getState().error).toBeNull();
    });

    it("sets initial progress", () => {
      const store = useSearchStore.getState();
      store.startSearch();

      const progress = useSearchStore.getState().progress;
      expect(progress.stage).toBe("identifying");
      expect(progress.percentage).toBe(10);
    });
  });

  describe("updateProgress", () => {
    it("updates progress stage and percentage", () => {
      const store = useSearchStore.getState();
      store.updateProgress("researching", 45, "Analyzing...");

      const progress = useSearchStore.getState().progress;
      expect(progress.stage).toBe("researching");
      expect(progress.percentage).toBe(45);
      expect(progress.message).toBe("Analyzing...");
    });

    it("stops searching on complete", () => {
      useSearchStore.setState({ isSearching: true });
      const store = useSearchStore.getState();
      store.updateProgress("complete", 100);

      expect(useSearchStore.getState().isSearching).toBe(false);
    });

    it("stops searching on error", () => {
      useSearchStore.setState({ isSearching: true });
      const store = useSearchStore.getState();
      store.updateProgress("error", 0);

      expect(useSearchStore.getState().isSearching).toBe(false);
    });
  });

  describe("setError", () => {
    it("sets error message", () => {
      const store = useSearchStore.getState();
      store.setError("Search failed");

      expect(useSearchStore.getState().error).toBe("Search failed");
    });

    it("stops searching", () => {
      useSearchStore.setState({ isSearching: true });
      const store = useSearchStore.getState();
      store.setError("Error");

      expect(useSearchStore.getState().isSearching).toBe(false);
    });

    it("sets progress stage to error", () => {
      const store = useSearchStore.getState();
      store.setError("Error message");

      expect(useSearchStore.getState().progress.stage).toBe("error");
    });
  });

  describe("reset", () => {
    it("resets all search state", () => {
      const store = useSearchStore.getState();
      store.setQuery("iPhone 15");
      store.startSearch();
      store.updateProgress("researching", 50);
      store.reset();

      const state = useSearchStore.getState();
      expect(state.query).toBe("");
      expect(state.isSearching).toBe(false);
      expect(state.progress.stage).toBe("identifying");
      expect(state.progress.percentage).toBe(0);
      expect(state.error).toBeNull();
    });
  });
});
