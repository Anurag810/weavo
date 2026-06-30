import { Component } from "react";
import { renderNode } from "../schema-renderer/renderer.jsx";

/**
 * Guards the live preview against render errors from in-progress schemas.
 */
class PreviewBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.schemaKey !== this.props.schemaKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="weavo-pg-preview-error">
          Preview error: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export function PreviewPanel({ schema }) {
  const isEmpty = !schema?.children?.[0]?.children?.length;
  const schemaKey = JSON.stringify(schema);

  return (
    <section className="weavo-pg-preview">
      <h3 className="weavo-pg-panel-title">Live Preview</h3>
      <div className="weavo-pg-preview-surface">
        {isEmpty ? (
          <p className="weavo-pg-preview-empty">Your preview will appear here as you add components.</p>
        ) : (
          <PreviewBoundary schemaKey={schemaKey}>
            {renderNode(schema, "pg-preview", {})}
          </PreviewBoundary>
        )}
      </div>
    </section>
  );
}

export default PreviewPanel;
