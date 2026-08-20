import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
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
    console.error('[ErrorBoundary] Uncaught rendering exception:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 font-sans">
          <div className="max-w-md w-full glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                YNR HAPPY HOMES • UNHANDLED EXCEPTION
              </span>
              <h2 className="text-2xl font-bold text-white font-heading">Something went wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected application error occurred while rendering this component. Your session data remains safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-red-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
