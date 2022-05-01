import StationLabelsControl from "../../../src/components/map/station-labels-control";

describe("StationLabelsControl", () => {
  it("should set and return the right state", () => {
    const container = document.createElement('div');
    const mockOnClick = jest.fn();

    const control = new StationLabelsControl({
      container: container,
      showStationLabels: false,
      onClick: () => {mockOnClick()},
    });
    control.onAdd();
    expect(control._button.className).toEqual("mapbox-gl-draw_ctrl-draw-btn fas fa-comment");

    control.setState(true)
    expect(control._button.className).toEqual("mapbox-gl-draw_ctrl-draw-btn fas fa-comment-slash");

    control._button.onclick();
    expect(mockOnClick.mock.calls.length).toBe(1);
  });
});
