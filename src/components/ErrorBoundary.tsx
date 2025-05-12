import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log error to the console (or send to a service)
    console.error('Client-side error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#fee', color: '#900', padding: 16, borderRadius: 8, margin: 16 }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{String(this.state.error)}</pre>
          <p>Please reload the page or contact support if this persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
} 