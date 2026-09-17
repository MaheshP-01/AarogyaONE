import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-lg mx-auto my-8 bg-white border border-rose-200 rounded-xl shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              {this.props.fallbackTitle || 'Unable to display this view'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              A temporary issue occurred while rendering this section.
            </p>
            {this.state.error?.message && (
              <p className="text-2xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-100 font-mono mt-2 text-left overflow-x-auto">
                {this.state.error.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              type="button"
              onClick={() => {
                this.handleReset();
                window.location.reload();
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <Link
              to="/health-worker"
              onClick={this.handleReset}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
