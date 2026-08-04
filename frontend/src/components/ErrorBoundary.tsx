import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-error-50 text-error-500">
            <AlertTriangle size={36} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold text-brand-950">Something went wrong</h1>
          <p className="mt-2 text-sm text-black/55">
            An unexpected error occurred. Try reloading the page.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
