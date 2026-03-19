


import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 px-10">
              <p className="text-slate-500 font-bold text-lg mb-2">Xatolik yuz berdi</p>
              <p className="text-slate-400 text-sm">Sahifani yangilang yoki qayta urinib ko'ring</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Qayta urinish
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
