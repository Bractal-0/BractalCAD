export default class ToolManager {
  constructor() {
    this.activeTool = null;
  }

  setTool(tool) {
    if (this.activeTool === tool) {
      this.activeTool?.disable?.();
      this.activeTool = null;
      console.log('Tool deselected');
    } else {
      this.activeTool?.disable?.(); // disable the previous tool
      this.activeTool = tool;
      this.activeTool?.enable?.();
      console.log('Tool selected:', tool.constructor.name);
    }
  }

  onMouseDown(event) {
    this.activeTool?.draw?.(event);
  }

  onMouseMove(event) {
    this.activeTool?.onMouseMove?.(event);
  }

  onMouseUp(event) {
    this.activeTool?.onMouseUp?.(event);
  }
}
