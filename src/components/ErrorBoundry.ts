/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.log("Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement("h2", null, this.state.error?.message);
    }

    return this.props.children;
  }
}
